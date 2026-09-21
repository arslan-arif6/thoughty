import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_CONFIG } from "@/constants/app";
import { CreateThoughtInput, Thought, ThoughtType, UpdateThoughtInput } from "@/types/thought";
import { createId } from "@/utils/ids";
import { thoughtSchema } from "@/utils/validation";
import { ThoughtRepository } from "./ThoughtRepository";

const DB_NAME = "thoughtly.db";
const MIGRATION_FLAG_KEY = "thoughtly.storage.migratedToSqlite.v1";

// Row shape as stored in SQLite (snake_case columns -> mapped to Thought)
type Row = {
    id: string;
    content: string;
    type: string;
    status: string;
    created_at: string;
    updated_at: string;
    due_at: string | null;
    reminder_at: string | null;
    notification_id: string | null;
    audio_uri: string | null;
    source: string | null;
};

function rowToThought(row: Row): Thought {
    return {
        id: row.id,
        content: row.content,
        type: row.type as ThoughtType,
        status: row.status as Thought["status"],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        dueAt: row.due_at,
        reminderAt: row.reminder_at,
        notificationId: row.notification_id,
        audioUri: row.audio_uri,
        source: (row.source as Thought["source"]) ?? "text",
    };
}

export class SqliteThoughtRepository implements ThoughtRepository {
    private dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

    private async db(): Promise<SQLite.SQLiteDatabase> {
        if (!this.dbPromise) this.dbPromise = this.init();
        return this.dbPromise;
    }

    private async init(): Promise<SQLite.SQLiteDatabase> {
        const db = await SQLite.openDatabaseAsync(DB_NAME);
        await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS thoughts (
        id TEXT PRIMARY KEY NOT NULL,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        due_at TEXT,
        reminder_at TEXT,
        notification_id TEXT,
        audio_uri TEXT,
        source TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_thoughts_type ON thoughts(type);
      CREATE INDEX IF NOT EXISTS idx_thoughts_status ON thoughts(status);
    `);
        await this.migrateFromAsyncStorage(db);
        return db;
    }

    // One-time: if old AsyncStorage blob exists, copy rows into SQLite.
    // Old key is kept untouched (not deleted) so it acts as a backup until you're confident.
    private async migrateFromAsyncStorage(db: SQLite.SQLiteDatabase): Promise<void> {
        const alreadyMigrated = await AsyncStorage.getItem(MIGRATION_FLAG_KEY);
        if (alreadyMigrated) return;

        try {
            const raw = await AsyncStorage.getItem(APP_CONFIG.storageKey);
            if (raw) {
                const parsed = JSON.parse(raw) as { thoughts?: unknown[] };
                const thoughts = Array.isArray(parsed.thoughts)
                    ? parsed.thoughts.map((item) => thoughtSchema.safeParse(item)).filter((r) => r.success).map((r) => r.data)
                    : [];
                for (const t of thoughts) {
                    await db.runAsync(
                        `INSERT OR IGNORE INTO thoughts (id, content, type, status, created_at, updated_at, due_at, reminder_at, notification_id, audio_uri, source)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            t.id,
                            t.content,
                            t.type,
                            t.status,
                            t.createdAt,
                            t.updatedAt,
                            t.dueAt ?? null,
                            t.reminderAt ?? null,
                            t.notificationId ?? null,
                            t.audioUri ?? null,
                            t.source ?? "text",
                        ],
                    );
                }
            }
        } finally {
            // Mark done even if there was nothing to migrate, so we don't re-check every launch.
            await AsyncStorage.setItem(MIGRATION_FLAG_KEY, "true");
        }
    }

    async getAll(): Promise<Thought[]> {
        const db = await this.db();
        const rows = await db.getAllAsync<Row>(`SELECT * FROM thoughts ORDER BY created_at DESC`);
        return rows.map(rowToThought);
    }

    async getById(id: string): Promise<Thought | null> {
        const db = await this.db();
        const row = await db.getFirstAsync<Row>(`SELECT * FROM thoughts WHERE id = ?`, [id]);
        return row ? rowToThought(row) : null;
    }

    async create(input: CreateThoughtInput): Promise<Thought> {
        const db = await this.db();
        const now = new Date().toISOString();
        const thought: Thought = {
            id: createId(),
            content: input.content.trim(),
            type: input.type ?? "inbox",
            status: "active",
            createdAt: now,
            updatedAt: now,
            dueAt: input.dueAt ?? null,
            reminderAt: input.reminderAt ?? null,
            notificationId: input.notificationId ?? null,
            audioUri: input.audioUri ?? null,
            source: input.source ?? "text",
        };
        await db.runAsync(
            `INSERT INTO thoughts (id, content, type, status, created_at, updated_at, due_at, reminder_at, notification_id, audio_uri, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                thought.id,
                thought.content,
                thought.type,
                thought.status,
                thought.createdAt,
                thought.updatedAt,
                thought.dueAt ?? null,
                thought.reminderAt ?? null,
                thought.notificationId ?? null,
                thought.audioUri ?? null,
                thought.source ?? "text",
            ],
        );
        return thought;
    }

    async update(id: string, input: UpdateThoughtInput): Promise<Thought | null> {
        const db = await this.db();
        const current = await this.getById(id);
        if (!current) return null;
        const updated: Thought = {
            ...current,
            ...input,
            content: input.content?.trim() ?? current.content,
            updatedAt: new Date().toISOString(),
        };
        await db.runAsync(
            `UPDATE thoughts SET content = ?, type = ?, status = ?, updated_at = ?, due_at = ?, reminder_at = ?, notification_id = ?, audio_uri = ?, source = ?
       WHERE id = ?`,
            [
                updated.content,
                updated.type,
                updated.status,
                updated.updatedAt,
                updated.dueAt ?? null,
                updated.reminderAt ?? null,
                updated.notificationId ?? null,
                updated.audioUri ?? null,
                updated.source ?? "text",
                id,
            ],
        );
        return updated;
    }

    async delete(id: string): Promise<void> {
        const db = await this.db();
        await db.runAsync(`DELETE FROM thoughts WHERE id = ?`, [id]);
    }

    async archive(id: string): Promise<Thought | null> {
        return this.update(id, { status: "archived" });
    }

    async restore(id: string): Promise<Thought | null> {
        return this.update(id, { status: "active" });
    }

    async search(query: string, type: ThoughtType | "all" | "archived" = "all"): Promise<Thought[]> {
        const db = await this.db();
        const needle = `%${query.trim().toLowerCase()}%`;
        let sql = `SELECT * FROM thoughts WHERE lower(content) LIKE ?`;
        const params: (string | null)[] = [needle];

        if (type === "archived") {
            sql += ` AND status = 'archived'`;
        } else if (type !== "all") {
            sql += ` AND type = ? AND status != 'archived'`;
            params.push(type);
        } else {
            sql += ` AND status != 'archived'`;
        }
        sql += ` ORDER BY created_at DESC`;

        const rows = await db.getAllAsync<Row>(sql, params);
        return rows.map(rowToThought);
    }

    async clearArchive(): Promise<void> {
        const db = await this.db();
        await db.runAsync(`DELETE FROM thoughts WHERE status = 'archived'`);
    }

    async replaceAll(thoughts: Thought[]): Promise<void> {
        const db = await this.db();
        await db.withTransactionAsync(async () => {
            await db.runAsync(`DELETE FROM thoughts`);
            for (const t of thoughts) {
                await db.runAsync(
                    `INSERT INTO thoughts (id, content, type, status, created_at, updated_at, due_at, reminder_at, notification_id, audio_uri, source)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        t.id,
                        t.content,
                        t.type,
                        t.status,
                        t.createdAt,
                        t.updatedAt,
                        t.dueAt ?? null,
                        t.reminderAt ?? null,
                        t.notificationId ?? null,
                        t.audioUri ?? null,
                        t.source ?? "text",
                    ],
                );
            }
        });
    }
}

export const thoughtRepository = new SqliteThoughtRepository();
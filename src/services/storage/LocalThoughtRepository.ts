import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_CONFIG } from "@/constants/app";
import { CreateThoughtInput, Thought, ThoughtType, UpdateThoughtInput } from "@/types/thought";
import { createId } from "@/utils/ids";
import { thoughtSchema } from "@/utils/validation";
import { ThoughtRepository } from "./ThoughtRepository";

type StoredData = { version: number; thoughts: Thought[] };

export class LocalThoughtRepository implements ThoughtRepository {
  async getAll(): Promise<Thought[]> {
    const stored = await this.read();
    return stored.thoughts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getById(id: string): Promise<Thought | null> {
    const thoughts = await this.getAll();
    return thoughts.find((thought) => thought.id === id) ?? null;
  }

  async create(input: CreateThoughtInput): Promise<Thought> {
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
    const data = await this.read();
    await this.write({ ...data, thoughts: [thought, ...data.thoughts] });
    return thought;
  }

  async update(id: string, input: UpdateThoughtInput): Promise<Thought | null> {
    const data = await this.read();
    let updated: Thought | null = null;
    const thoughts = data.thoughts.map((thought) => {
      if (thought.id !== id) return thought;
      updated = { ...thought, ...input, content: input.content?.trim() ?? thought.content, updatedAt: new Date().toISOString() };
      return updated;
    });
    await this.write({ ...data, thoughts });
    return updated;
  }

  async delete(id: string): Promise<void> {
    const data = await this.read();
    await this.write({ ...data, thoughts: data.thoughts.filter((thought) => thought.id !== id) });
  }

  async archive(id: string): Promise<Thought | null> {
    return this.update(id, { status: "archived" });
  }

  async restore(id: string): Promise<Thought | null> {
    return this.update(id, { status: "active" });
  }

  async search(query: string, type: ThoughtType | "all" | "archived" = "all"): Promise<Thought[]> {
    const needle = query.trim().toLowerCase();
    const thoughts = await this.getAll();
    return thoughts.filter((thought) => {
      const typeMatches = type === "all" || (type === "archived" ? thought.status === "archived" : thought.type === type);
      const activeMatches = type === "archived" || thought.status !== "archived";
      const queryMatches = !needle || thought.content.toLowerCase().includes(needle) || thought.type.includes(needle);
      return typeMatches && activeMatches && queryMatches;
    });
  }

  async clearArchive(): Promise<void> {
    const data = await this.read();
    await this.write({ ...data, thoughts: data.thoughts.filter((thought) => thought.status !== "archived") });
  }

  async replaceAll(thoughts: Thought[]): Promise<void> {
    await this.write({ version: APP_CONFIG.exportVersion, thoughts });
  }

  private async read(): Promise<StoredData> {
    try {
      const raw = await AsyncStorage.getItem(APP_CONFIG.storageKey);
      if (!raw) return { version: APP_CONFIG.exportVersion, thoughts: [] };
      const parsed = JSON.parse(raw) as StoredData;
      const thoughts = Array.isArray(parsed.thoughts)
        ? parsed.thoughts.map((item) => thoughtSchema.safeParse(item)).filter((result) => result.success).map((result) => result.data)
        : [];
      return { version: parsed.version || APP_CONFIG.exportVersion, thoughts };
    } catch {
      return { version: APP_CONFIG.exportVersion, thoughts: [] };
    }
  }

  private async write(data: StoredData): Promise<void> {
    await AsyncStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(data));
  }
}

export const thoughtRepository = new LocalThoughtRepository();

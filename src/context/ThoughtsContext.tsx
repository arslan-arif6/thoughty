import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { Thought, ThoughtType, UpdateThoughtInput } from "@/types/thought";
import { thoughtRepository } from "@/services/storage/SqliteThoughtRepository";
import { notificationService } from "@/services/notifications/NotificationService";
import { dataTransferService } from "@/services/data/DataTransferService";

type FeedbackKind = "success" | "error" | "info";
type Feedback = { message: string; kind: FeedbackKind } | null;

type ThoughtsContextValue = {
  thoughts: Thought[];
  loading: boolean;
  feedback: Feedback;
  setFeedback: (feedback: Feedback) => void;
  refresh: () => Promise<void>;
  captureThought: (content: string, audioUri?: string | null) => Promise<void>;
  updateThought: (id: string, input: UpdateThoughtInput) => Promise<void>;
  classifyThought: (id: string, type: ThoughtType) => Promise<void>;
  setReminder: (id: string, reminderAt: string | null) => Promise<void>;
  completeThought: (id: string, completed: boolean) => Promise<void>;
  archiveThought: (id: string) => Promise<void>;
  restoreThought: (id: string) => Promise<void>;
  deleteThought: (id: string, permanent?: boolean) => Promise<void>;
  clearArchive: () => Promise<void>;
  exportData: () => Promise<void>;
  importData: () => Promise<void>;
};

const ThoughtsContext = createContext<ThoughtsContextValue | null>(null);

export function ThoughtsProvider({ children }: { children: React.ReactNode }) {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const refresh = useCallback(async () => {
    try {
      setThoughts(await thoughtRepository.getAll());
    } catch {
      setFeedback({ message: "Could not load thoughts.", kind: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 1800);
    return () => clearTimeout(timer);
  }, [feedback]);

  const captureThought = useCallback(
    async (content: string, audioUri?: string | null) => {
      if (!content.trim() && !audioUri) return;
      await thoughtRepository.create({
        content: content.trim() || "Voice thought",
        source: audioUri ? "voice" : "text",
        audioUri,
      });
      setFeedback({ message: "Captured.", kind: "success" });
      await refresh();
    },
    [refresh],
  );

  const updateThought = useCallback(
    async (id: string, input: UpdateThoughtInput) => {
      const current = thoughts.find((thought) => thought.id === id);
      if (input.reminderAt !== undefined && current?.notificationId) await notificationService.cancelReminder(current.notificationId);
      let notificationId = input.notificationId;
      if (input.reminderAt) notificationId = await notificationService.scheduleReminder(input.content ?? current?.content ?? "Reminder", input.reminderAt);
      await thoughtRepository.update(id, { ...input, notificationId });
      setFeedback({ message: "Saved.", kind: "success" });
      await refresh();
    },
    [refresh, thoughts],
  );

  const classifyThought = useCallback(
    async (id: string, type: ThoughtType) => {
      await thoughtRepository.update(id, { type });
      setFeedback({ message: "Updated.", kind: "success" });
      await refresh();
    },
    [refresh],
  );

  const setReminder = useCallback(
    async (id: string, reminderAt: string | null) => {
      const thought = thoughts.find((item) => item.id === id);
      if (!thought) return;
      if (thought.notificationId) await notificationService.cancelReminder(thought.notificationId);
      const notificationId = reminderAt ? await notificationService.scheduleReminder(thought.content, reminderAt) : null;
      await thoughtRepository.update(id, { reminderAt, notificationId, type: reminderAt ? "reminder" : thought.type });
      setFeedback({ message: reminderAt ? "Reminder set." : "Reminder removed.", kind: notificationId || !reminderAt ? "success" : "info" });
      await refresh();
    },
    [refresh, thoughts],
  );

  const completeThought = useCallback(
    async (id: string, completed: boolean) => {
      await thoughtRepository.update(id, { status: completed ? "completed" : "active" });
      setFeedback({ message: completed ? "Done." : "Reopened.", kind: "success" });
      await refresh();
    },
    [refresh],
  );

  const archiveThought = useCallback(
    async (id: string) => {
      const thought = thoughts.find((item) => item.id === id);
      if (thought?.notificationId) await notificationService.cancelReminder(thought.notificationId);
      await thoughtRepository.update(id, { status: "archived", notificationId: null });
      setFeedback({ message: "Archived.", kind: "success" });
      await refresh();
    },
    [refresh, thoughts],
  );

  const restoreThought = useCallback(
    async (id: string) => {
      await thoughtRepository.restore(id);
      setFeedback({ message: "Restored.", kind: "success" });
      await refresh();
    },
    [refresh],
  );

  const deleteThought = useCallback(
    async (id: string, permanent = false) => {
      const thought = thoughts.find((item) => item.id === id);
      if (!thought) return;
      if (!permanent && thought.status !== "archived") {
        await archiveThought(id);
        return;
      }
      if (thought.notificationId) await notificationService.cancelReminder(thought.notificationId);
      await thoughtRepository.delete(id);
      setFeedback({ message: "Deleted.", kind: "success" });
      await refresh();
    },
    [archiveThought, refresh, thoughts],
  );

  const clearArchive = useCallback(async () => {
    await thoughtRepository.clearArchive();
    setFeedback({ message: "Archive cleared.", kind: "success" });
    await refresh();
  }, [refresh]);

  const exportData = useCallback(async () => {
    try {
      await dataTransferService.exportThoughts(thoughts);
      setFeedback({ message: "Export ready.", kind: "success" });
    } catch {
      setFeedback({ message: "Export failed.", kind: "error" });
    }
  }, [thoughts]);

  const importData = useCallback(async () => {
    try {
      const imported = await dataTransferService.importThoughts();
      if (!imported.length) return;
      Alert.alert("Import data?", "This will replace local Thoughtly data with the selected export.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Import",
          onPress: () => {
            void thoughtRepository.replaceAll(imported).then(refresh);
            setFeedback({ message: "Imported.", kind: "success" });
          },
        },
      ]);
    } catch {
      setFeedback({ message: "Import file was not valid.", kind: "error" });
    }
  }, [refresh]);

  const value = useMemo(
    () => ({
      thoughts,
      loading,
      feedback,
      setFeedback,
      refresh,
      captureThought,
      updateThought,
      classifyThought,
      setReminder,
      completeThought,
      archiveThought,
      restoreThought,
      deleteThought,
      clearArchive,
      exportData,
      importData,
    }),
    [archiveThought, captureThought, classifyThought, clearArchive, completeThought, deleteThought, exportData, feedback, importData, loading, refresh, restoreThought, setReminder, thoughts, updateThought],
  );

  return <ThoughtsContext.Provider value={value}>{children}</ThoughtsContext.Provider>;
}

export function useThoughtsContext() {
  const context = useContext(ThoughtsContext);
  if (!context) throw new Error("useThoughtsContext must be used within ThoughtsProvider");
  return context;
}

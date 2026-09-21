import { z } from "zod";
import { thoughtStatuses, thoughtTypes } from "@/types/thought";

export const thoughtSchema = z.object({
  id: z.string().min(1),
  content: z.string().min(1),
  type: z.enum(thoughtTypes),
  status: z.enum(thoughtStatuses),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  dueAt: z.string().datetime().nullable().optional(),
  reminderAt: z.string().datetime().nullable().optional(),
  notificationId: z.string().nullable().optional(),
  audioUri: z.string().nullable().optional(),
  source: z.enum(["text", "voice"]).optional(),
});

export const exportSchema = z.object({
  version: z.number(),
  exportedAt: z.string().datetime(),
  thoughts: z.array(thoughtSchema),
});

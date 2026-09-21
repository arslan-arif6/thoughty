export const thoughtTypes = ["inbox", "task", "idea", "reminder", "reference"] as const;
export const thoughtStatuses = ["active", "completed", "archived"] as const;

export type ThoughtType = (typeof thoughtTypes)[number];
export type ThoughtStatus = (typeof thoughtStatuses)[number];

export type Thought = {
  id: string;
  content: string;
  type: ThoughtType;
  status: ThoughtStatus;
  createdAt: string;
  updatedAt: string;
  dueAt?: string | null;
  reminderAt?: string | null;
  notificationId?: string | null;
  audioUri?: string | null;
  source?: "text" | "voice";
};

export type CreateThoughtInput = {
  content: string;
  type?: ThoughtType;
  dueAt?: string | null;
  reminderAt?: string | null;
  notificationId?: string | null;
  audioUri?: string | null;
  source?: "text" | "voice";
};

export type UpdateThoughtInput = Partial<Omit<Thought, "id" | "createdAt" | "updatedAt">>;

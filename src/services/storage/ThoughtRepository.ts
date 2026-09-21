import { CreateThoughtInput, Thought, ThoughtType, UpdateThoughtInput } from "@/types/thought";

export interface ThoughtRepository {
  getAll(): Promise<Thought[]>;
  getById(id: string): Promise<Thought | null>;
  create(input: CreateThoughtInput): Promise<Thought>;
  update(id: string, input: UpdateThoughtInput): Promise<Thought | null>;
  delete(id: string): Promise<void>;
  archive(id: string): Promise<Thought | null>;
  restore(id: string): Promise<Thought | null>;
  search(query: string, type?: ThoughtType | "all" | "archived"): Promise<Thought[]>;
  clearArchive(): Promise<void>;
  replaceAll(thoughts: Thought[]): Promise<void>;
}

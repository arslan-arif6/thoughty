import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { APP_CONFIG } from "@/constants/app";
import { Thought } from "@/types/thought";
import { exportSchema } from "@/utils/validation";

export type ExportPayload = { version: number; exportedAt: string; thoughts: Thought[] };

export class DataTransferService {
  async exportThoughts(thoughts: Thought[]): Promise<string> {
    const payload: ExportPayload = { version: APP_CONFIG.exportVersion, exportedAt: new Date().toISOString(), thoughts };
    const uri = `${FileSystem.cacheDirectory}${APP_CONFIG.name.toLowerCase()}-export.json`;
    await FileSystem.writeAsStringAsync(uri, JSON.stringify(payload, null, 2), { encoding: FileSystem.EncodingType.UTF8 });
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: "application/json", dialogTitle: "Export Thoughtly data" });
    return uri;
  }

  async importThoughts(): Promise<Thought[]> {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/json", copyToCacheDirectory: true });
    if (result.canceled || !result.assets?.[0]?.uri) return [];
    const raw = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.UTF8 });
    const parsed = exportSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) throw new Error("Invalid Thoughtly export file");
    return parsed.data.thoughts;
  }
}

export const dataTransferService = new DataTransferService();

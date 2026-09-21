import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Mic, Square } from "lucide-react-native";
import { theme } from "@/theme/theme";
import { useVoiceRecorder } from "@/services/audio/useVoiceRecorder";
import { transcriptionService } from "@/services/transcription/TranscriptionService";

export function VoiceCaptureButton({ onSaved, onMessage }: { onSaved: (audioUri: string, text: string | null) => Promise<void>; onMessage: (message: string, error?: boolean) => void }) {
  const [busy, setBusy] = useState(false);
  const recorder = useVoiceRecorder();
  const recording = recorder.recording || busy;

  const toggle = async () => {
    try {
      if (!recording) {
        setBusy(true);
        await recorder.start();
        setBusy(false);
        onMessage("Recording...");
        return;
      }
      const uri = await recorder.stop();
      setBusy(false);
      if (!uri) {
        onMessage("Recording could not be saved.", true);
        return;
      }
      const text = await transcriptionService.transcribe(uri);
      await onSaved(uri, text);
      onMessage(text ? "Voice captured." : "Voice saved. Transcription unavailable.");
    } catch {
      setBusy(false);
      onMessage("Microphone permission or recording failed.", true);
    }
  };

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={recording ? "Stop voice recording" : "Start voice recording"} onPress={toggle} style={({ pressed }) => [styles.button, recording && styles.recording, pressed && styles.pressed]}>
      <View style={styles.icon}>{recording ? <Square size={18} color={theme.colors.danger} /> : <Mic size={18} color={theme.colors.primary} />}</View>
      <Text style={styles.label}>{recording ? "Stop recording" : "Voice capture"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 46, borderRadius: theme.radius.md, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: theme.spacing.sm, paddingHorizontal: theme.spacing.md },
  recording: { backgroundColor: theme.colors.dangerSoft, borderColor: theme.colors.danger },
  icon: { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.primarySoft, alignItems: "center", justifyContent: "center" },
  label: { color: theme.colors.text, fontWeight: "800" },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.85 },
});

import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "@/theme/theme";
import { AppButton } from "@/components/common/AppButton";
import { VoiceCaptureButton } from "./VoiceCaptureButton";
import { useThoughts } from "@/hooks/useThoughts";

export function CaptureBox() {
  const [content, setContent] = useState("");
  const [voiceMessage, setVoiceMessage] = useState<string | null>(null);
  const { captureThought, setFeedback } = useThoughts();

  const save = async () => {
    if (!content.trim()) return;
    await captureThought(content);
    setContent("");
  };

  return (
    <View style={styles.box}>
      <Text style={styles.kicker}>Capture</Text>
      <Text style={styles.title}>What's on your mind?</Text>
      <TextInput
        accessibilityLabel="Type a thought"
        multiline
        placeholder="Type a thought..."
        placeholderTextColor={theme.colors.textSubtle}
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />
      <View style={styles.actions}>
        <AppButton label="Save" onPress={save} disabled={!content.trim()} style={styles.save} />
        <VoiceCaptureButton
          onSaved={async (audioUri, text) => captureThought(text || "Voice thought", audioUri)}
          onMessage={(message, error) => {
            setVoiceMessage(message);
            setFeedback({ message, kind: error ? "error" : "info" });
          }}
        />
      </View>
      {voiceMessage ? <Text style={styles.voiceText}>{voiceMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: theme.colors.surfaceAccent, borderRadius: theme.radius.xl, padding: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border, gap: theme.spacing.md },
  kicker: { color: theme.colors.primary, fontSize: 13, fontWeight: "900", textTransform: "uppercase" },
  title: { color: theme.colors.text, fontSize: 28, lineHeight: 34, fontWeight: "900" },
  input: { minHeight: 96, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, color: theme.colors.text, fontSize: 16, lineHeight: 22, textAlignVertical: "top" },
  actions: { gap: theme.spacing.md },
  save: { width: "100%" },
  voiceText: { color: theme.colors.textMuted, fontSize: 13, fontWeight: "600" },
});

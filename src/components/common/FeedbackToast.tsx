import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme/theme";
import { useThoughts } from "@/hooks/useThoughts";

export function FeedbackToast() {
  const { feedback } = useThoughts();
  if (!feedback) return null;
  const backgroundColor = feedback.kind === "error" ? theme.colors.danger : feedback.kind === "info" ? theme.colors.warning : theme.colors.success;
  return (
    <View pointerEvents="none" style={[styles.toast, { backgroundColor }]}>
      <Text style={styles.text}>{feedback.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: { position: "absolute", left: theme.spacing.lg, right: theme.spacing.lg, bottom: theme.spacing.lg, borderRadius: theme.radius.lg, padding: theme.spacing.md, alignItems: "center" },
  text: { color: theme.colors.surface, fontWeight: "800" },
});

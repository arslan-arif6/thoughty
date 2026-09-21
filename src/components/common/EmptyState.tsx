import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme/theme";

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, padding: theme.spacing.xl, alignItems: "center", gap: theme.spacing.sm },
  title: { color: theme.colors.text, fontSize: 18, fontWeight: "800" },
  message: { color: theme.colors.textMuted, fontSize: 14, textAlign: "center", lineHeight: 20 },
});

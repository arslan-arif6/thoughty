import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme/theme";
import { ThoughtType } from "@/types/thought";

const labels: Record<ThoughtType, string> = {
  inbox: "Inbox",
  task: "Task",
  idea: "Idea",
  reminder: "Reminder",
  reference: "Reference",
};

const colors: Record<ThoughtType, { color: string; backgroundColor: string }> = {
  inbox: { color: theme.colors.inbox, backgroundColor: theme.colors.inboxSoft },
  task: { color: theme.colors.task, backgroundColor: theme.colors.taskSoft },
  idea: { color: theme.colors.idea, backgroundColor: theme.colors.ideaSoft },
  reminder: { color: theme.colors.reminder, backgroundColor: theme.colors.reminderSoft },
  reference: { color: theme.colors.reference, backgroundColor: theme.colors.referenceSoft },
};

export function ThoughtTypeBadge({ type }: { type: ThoughtType }) {
  return (
    <View style={[styles.badge, { backgroundColor: colors[type].backgroundColor }]}>
      <Text style={[styles.text, { color: colors[type].color }]}>{labels[type]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 999, paddingHorizontal: theme.spacing.md, paddingVertical: 6 },
  text: { fontSize: 12, fontWeight: "800" },
});

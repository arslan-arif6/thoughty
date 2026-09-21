import React from "react";
import { StyleSheet, Text } from "react-native";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { ThoughtCard } from "@/components/thoughts/ThoughtCard";
import { EmptyState } from "@/components/common/EmptyState";
import { theme } from "@/theme/theme";
import { useThoughts } from "@/hooks/useThoughts";

export default function RemindersScreen() {
  const { thoughts } = useThoughts();
  const reminders = thoughts.filter((thought) => thought.status !== "archived" && thought.reminderAt).sort((a, b) => (a.reminderAt ?? "").localeCompare(b.reminderAt ?? ""));
  return (
    <ScreenContainer>
      <Text style={styles.title}>Reminders</Text>
      {reminders.length ? reminders.map((thought) => <ThoughtCard key={thought.id} thought={thought} />) : <EmptyState title="No reminders." message="Add a reminder from any thought detail screen." />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ title: { color: theme.colors.text, fontSize: 30, fontWeight: "900", marginBottom: theme.spacing.lg } });

import React from "react";
import { StyleSheet, Text } from "react-native";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { ThoughtCard } from "@/components/thoughts/ThoughtCard";
import { EmptyState } from "@/components/common/EmptyState";
import { theme } from "@/theme/theme";
import { useThoughts } from "@/hooks/useThoughts";

export default function TasksScreen() {
  const { thoughts } = useThoughts();
  const tasks = thoughts.filter((thought) => thought.type === "task" && thought.status !== "archived");
  return (
    <ScreenContainer>
      <Text style={styles.title}>Tasks</Text>
      {tasks.length ? tasks.map((thought) => <ThoughtCard key={thought.id} thought={thought} />) : <EmptyState title="Nothing to do." message="Enjoy the empty list." />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ title: { color: theme.colors.text, fontSize: 30, fontWeight: "900", marginBottom: theme.spacing.lg } });

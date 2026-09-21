import React from "react";
import { StyleSheet, Text } from "react-native";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { ThoughtCard } from "@/components/thoughts/ThoughtCard";
import { EmptyState } from "@/components/common/EmptyState";
import { theme } from "@/theme/theme";
import { useThoughts } from "@/hooks/useThoughts";

export default function IdeasScreen() {
  const { thoughts } = useThoughts();
  const ideas = thoughts.filter((thought) => thought.type === "idea" && thought.status !== "archived");
  return (
    <ScreenContainer>
      <Text style={styles.title}>Ideas</Text>
      <Text style={styles.subtitle}>Random thoughts can become great ideas.</Text>
      {ideas.length ? ideas.map((thought) => <ThoughtCard key={thought.id} thought={thought} />) : <EmptyState title="No ideas yet." message="Random thoughts can become great ideas." />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: theme.colors.text, fontSize: 30, fontWeight: "900" },
  subtitle: { color: theme.colors.textMuted, fontSize: 15, marginBottom: theme.spacing.lg, marginTop: theme.spacing.xs },
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { SectionHeader } from "@/components/common/SectionHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ThoughtCard } from "@/components/thoughts/ThoughtCard";
import { AppButton } from "@/components/common/AppButton";
import { theme } from "@/theme/theme";
import { Thought, ThoughtType } from "@/types/thought";
import { useThoughts } from "@/hooks/useThoughts";

function ProcessCard({ thought }: { thought: Thought }) {
  const { classifyThought, archiveThought, deleteThought } = useThoughts();
  const convert = (type: ThoughtType) => classifyThought(thought.id, type);
  return (
    <View style={styles.process}>
      <ThoughtCard thought={thought} compact />
      <View style={styles.grid}>
        <AppButton label="Task" onPress={() => convert("task")} variant="soft" style={styles.button} />
        <AppButton label="Idea" onPress={() => convert("idea")} variant="soft" style={styles.button} />
        <AppButton label="Reminder" onPress={() => convert("reminder")} variant="soft" style={styles.button} />
        <AppButton label="Reference" onPress={() => convert("reference")} variant="soft" style={styles.button} />
      </View>
      <View style={styles.grid}>
        <AppButton label="Keep" onPress={() => convert("inbox")} variant="ghost" style={styles.button} />
        <AppButton label="Archive" onPress={() => archiveThought(thought.id)} variant="ghost" style={styles.button} />
        <AppButton label="Delete" onPress={() => deleteThought(thought.id)} variant="danger" style={styles.button} />
      </View>
    </View>
  );
}

export default function ReviewScreen() {
  const { thoughts } = useThoughts();
  const active = thoughts.filter((thought) => thought.status !== "archived");
  const inbox = active.filter((thought) => thought.type === "inbox");
  const tasks = active.filter((thought) => thought.type === "task").slice(0, 3);
  const ideas = active.filter((thought) => thought.type === "idea").slice(0, 3);
  const reminders = active.filter((thought) => thought.reminderAt).slice(0, 3);
  const caughtUp = !inbox.length && !tasks.length && !ideas.length && !reminders.length;
  return (
    <ScreenContainer>
      <Text style={styles.title}>Your thoughts</Text>
      <Text style={styles.subtitle}>What still needs attention?</Text>
      {caughtUp ? <EmptyState title="You're caught up." message="Nothing needs processing right now." /> : null}
      {inbox.length ? (
        <>
          <SectionHeader title="Needs attention" />
          {inbox.map((thought) => <ProcessCard key={thought.id} thought={thought} />)}
        </>
      ) : null}
      {tasks.length ? <Section title="Tasks" thoughts={tasks} /> : null}
      {ideas.length ? <Section title="Ideas" thoughts={ideas} /> : null}
      {reminders.length ? <Section title="Reminders" thoughts={reminders} /> : null}
    </ScreenContainer>
  );
}

function Section({ title, thoughts }: { title: string; thoughts: Thought[] }) {
  return (
    <>
      <SectionHeader title={title} />
      {thoughts.map((thought) => <ThoughtCard key={thought.id} thought={thought} compact />)}
    </>
  );
}

const styles = StyleSheet.create({
  title: { color: theme.colors.text, fontSize: 30, fontWeight: "900" },
  subtitle: { color: theme.colors.textMuted, fontSize: 15, marginTop: theme.spacing.xs },
  process: { marginBottom: theme.spacing.lg },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  button: { flexGrow: 1, minWidth: "30%" },
});

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Bell, Inbox, Lightbulb, ListTodo } from "lucide-react-native";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CaptureBox } from "@/components/capture/CaptureBox";
import { ThoughtCard } from "@/components/thoughts/ThoughtCard";
import { EmptyState } from "@/components/common/EmptyState";
import { theme } from "@/theme/theme";
import { APP_CONFIG } from "@/constants/app";
import { useThoughts } from "@/hooks/useThoughts";

function QuickTile({ label, count, icon, onPress }: { label: string; count: number; icon: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Open ${label}`} onPress={onPress} style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
      <View style={styles.tileIcon}>{icon}</View>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileCount}>{count}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { thoughts } = useThoughts();
  const active = thoughts.filter((thought) => thought.status !== "archived");
  const inbox = active.filter((thought) => thought.type === "inbox");
  const recent = active.slice(0, 3);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.name}>{APP_CONFIG.name}</Text>
      </View>
      <CaptureBox />
      <View style={styles.inboxPill}>
        <Inbox size={18} color={theme.colors.primary} />
        <Text style={styles.inboxText}>{inbox.length} in Brain Inbox</Text>
      </View>
      <SectionHeader title="Recent thoughts" />
      {recent.length ? recent.map((thought) => <ThoughtCard key={thought.id} thought={thought} compact />) : <EmptyState title="Your mind is clear." message="Capture something before you forget it." />}
      <SectionHeader title="Quick access" />
      <View style={styles.tiles}>
        <QuickTile label="Ideas" count={active.filter((thought) => thought.type === "idea").length} icon={<Lightbulb size={18} color={theme.colors.idea} />} onPress={() => router.push("/ideas")} />
        <QuickTile label="Tasks" count={active.filter((thought) => thought.type === "task").length} icon={<ListTodo size={18} color={theme.colors.task} />} onPress={() => router.push("/tasks")} />
        <QuickTile label="Reminders" count={active.filter((thought) => thought.reminderAt).length} icon={<Bell size={18} color={theme.colors.reminder} />} onPress={() => router.push("/reminders")} />
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Review your thoughts" onPress={() => router.push("/review")} style={({ pressed }) => [styles.review, pressed && styles.pressed]}>
        <Text style={styles.reviewText}>Process your thoughts</Text>
        <Text style={styles.reviewArrow}>→</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: theme.spacing.lg },
  greeting: { color: theme.colors.textMuted, fontSize: 16, fontWeight: "700" },
  name: { color: theme.colors.text, fontSize: 32, fontWeight: "900" },
  inboxPill: { marginTop: theme.spacing.lg, alignSelf: "flex-start", flexDirection: "row", gap: theme.spacing.sm, alignItems: "center", backgroundColor: theme.colors.primarySoft, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: 999 },
  inboxText: { color: theme.colors.primary, fontWeight: "800" },
  tiles: { flexDirection: "row", gap: theme.spacing.md },
  tile: { flex: 1, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, padding: theme.spacing.md, gap: theme.spacing.sm },
  tileIcon: { width: 34, height: 34, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceMuted, alignItems: "center", justifyContent: "center" },
  tileLabel: { color: theme.colors.textMuted, fontSize: 13, fontWeight: "700" },
  tileCount: { color: theme.colors.text, fontSize: 22, fontWeight: "900" },
  review: { marginTop: theme.spacing.xl, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  reviewText: { color: theme.colors.text, fontSize: 17, fontWeight: "800" },
  reviewArrow: { color: theme.colors.primary, fontSize: 22, fontWeight: "900" },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
});

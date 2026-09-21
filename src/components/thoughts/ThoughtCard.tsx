import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Bell, CheckCircle2, Circle, Lightbulb, Mic, Archive, BookOpen } from "lucide-react-native";
import { router } from "expo-router";
import { theme } from "@/theme/theme";
import { Thought, ThoughtType } from "@/types/thought";
import { formatDate, formatRelativeTime } from "@/utils/dates";
import { ThoughtTypeBadge } from "./ThoughtTypeBadge";

function Icon({ type, completed }: { type: ThoughtType; completed?: boolean }) {
  const size = 18;
  const color = type === "idea" ? theme.colors.idea : type === "task" ? theme.colors.task : type === "reminder" ? theme.colors.reminder : type === "reference" ? theme.colors.reference : theme.colors.inbox;
  if (completed) return <CheckCircle2 size={size} color={theme.colors.success} />;
  if (type === "idea") return <Lightbulb size={size} color={color} />;
  if (type === "task") return <Circle size={size} color={color} />;
  if (type === "reminder") return <Bell size={size} color={color} />;
  if (type === "reference") return <BookOpen size={size} color={color} />;
  return <Archive size={size} color={color} />;
}

export function ThoughtCard({ thought, compact = false }: { thought: Thought; compact?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Open thought: ${thought.content}`} onPress={() => router.push(`/thought/${thought.id}`)} style={({ pressed }) => [styles.card, compact && styles.compact, pressed && styles.pressed]}>
      <View style={styles.top}>
        <View style={styles.iconWrap}>
          <Icon type={thought.type} completed={thought.status === "completed"} />
        </View>
        <View style={styles.body}>
          <Text style={[styles.content, thought.status === "completed" && styles.completed]} numberOfLines={compact ? 2 : 4}>
            {thought.content}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{formatRelativeTime(thought.createdAt)}</Text>
            {thought.reminderAt ? <Text style={styles.meta}>Reminder {formatDate(thought.reminderAt)}</Text> : null}
            {thought.source === "voice" ? <Mic size={13} color={theme.colors.textSubtle} /> : null}
          </View>
        </View>
      </View>
      <ThoughtTypeBadge type={thought.type} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.lg, padding: theme.spacing.lg, marginBottom: theme.spacing.md, gap: theme.spacing.md, shadowColor: theme.colors.shadow, shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  compact: { padding: theme.spacing.md },
  pressed: { transform: [{ scale: 0.99 }], opacity: 0.9 },
  top: { flexDirection: "row", gap: theme.spacing.md },
  iconWrap: { width: 34, height: 34, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceMuted, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, gap: 6 },
  content: { color: theme.colors.text, fontSize: 16, fontWeight: "700", lineHeight: 22 },
  completed: { color: theme.colors.textMuted, textDecorationLine: "line-through" },
  metaRow: { flexDirection: "row", gap: theme.spacing.sm, flexWrap: "wrap", alignItems: "center" },
  meta: { color: theme.colors.textSubtle, fontSize: 12, fontWeight: "600" },
});

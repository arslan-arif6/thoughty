import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { AppButton } from "@/components/common/AppButton";
import { EmptyState } from "@/components/common/EmptyState";
import { ThoughtTypeBadge } from "@/components/thoughts/ThoughtTypeBadge";
import { theme } from "@/theme/theme";
import { ThoughtType, thoughtTypes } from "@/types/thought";
import { formatDate, parseReminderInput, splitIsoForInputs } from "@/utils/dates";
import { useThought, useThoughts } from "@/hooks/useThoughts";

export default function ThoughtDetailScreen() {
  const { id } = useLocalSearchParams();
  const thought = useThought(id);
  const { updateThought, classifyThought, completeThought, archiveThought, restoreThought, deleteThought, setReminder } = useThoughts();
  const [content, setContent] = useState(thought?.content ?? "");
  const initial = useMemo(() => splitIsoForInputs(thought?.reminderAt), [thought?.reminderAt]);
  const [dateText, setDateText] = useState(initial.date);
  const [timeText, setTimeText] = useState(initial.time);

  useEffect(() => {
    if (!thought) return;
    setContent(thought.content);
    const next = splitIsoForInputs(thought.reminderAt);
    setDateText(next.date);
    setTimeText(next.time);
  }, [thought?.id, thought?.content, thought?.reminderAt]);

  if (!thought) {
    return (
      <ScreenContainer>
        <BackHeader title="Thought" />
        <EmptyState title="Thought not found." message="It may have been deleted or imported over." />
      </ScreenContainer>
    );
  }

  const save = async () => updateThought(thought.id, { content });
  const saveReminder = async () => {
    const iso = parseReminderInput(dateText, timeText);
    if (!iso) {
      Alert.alert("Invalid reminder", "Use date as YYYY-MM-DD and time as HH:MM.");
      return;
    }
    await setReminder(thought.id, iso);
  };

  return (
    <ScreenContainer>
      <BackHeader title="Thought" />
      <View style={styles.card}>
        <ThoughtTypeBadge type={thought.type} />
        <TextInput accessibilityLabel="Edit thought content" multiline value={content} onChangeText={setContent} style={styles.input} />
        <View style={styles.meta}>
          <Text style={styles.metaText}>Captured {formatDate(thought.createdAt)}</Text>
          <Text style={styles.metaText}>Updated {formatDate(thought.updatedAt)}</Text>
          {thought.audioUri ? <Text style={styles.metaText}>Voice recording saved locally</Text> : null}
        </View>
        <AppButton label="Save changes" onPress={save} />
      </View>

      <Text style={styles.section}>Type</Text>
      <View style={styles.typeGrid}>
        {thoughtTypes.map((type) => (
          <Pressable key={type} onPress={() => classifyThought(thought.id, type)} style={[styles.typeButton, thought.type === type && styles.typeButtonActive]}>
            <Text style={[styles.typeText, thought.type === type && styles.typeTextActive]}>{type[0].toUpperCase() + type.slice(1)}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>Reminder</Text>
      <View style={styles.card}>
        <Text style={styles.hint}>Use local date and 24-hour time.</Text>
        <View style={styles.reminderRow}>
          <TextInput accessibilityLabel="Reminder date" placeholder="YYYY-MM-DD" placeholderTextColor={theme.colors.textSubtle} value={dateText} onChangeText={setDateText} style={styles.smallInput} />
          <TextInput accessibilityLabel="Reminder time" placeholder="HH:MM" placeholderTextColor={theme.colors.textSubtle} value={timeText} onChangeText={setTimeText} style={styles.smallInput} />
        </View>
        <View style={styles.actions}>
          <AppButton label="Set reminder" onPress={saveReminder} style={styles.flex} />
          <AppButton label="Remove" onPress={() => setReminder(thought.id, null)} variant="ghost" style={styles.flex} />
        </View>
        {thought.reminderAt ? <Text style={styles.metaText}>Current: {formatDate(thought.reminderAt)}</Text> : null}
      </View>

      <Text style={styles.section}>Actions</Text>
      <View style={styles.actions}>
        {thought.type === "task" ? <AppButton label={thought.status === "completed" ? "Uncomplete" : "Mark done"} onPress={() => completeThought(thought.id, thought.status !== "completed")} variant="soft" style={styles.flex} /> : null}
        {thought.status === "archived" ? <AppButton label="Restore" onPress={() => restoreThought(thought.id)} variant="soft" style={styles.flex} /> : <AppButton label="Archive" onPress={() => archiveThought(thought.id)} variant="ghost" style={styles.flex} />}
      </View>
      <AppButton
        label={thought.status === "archived" ? "Delete permanently" : "Delete"}
        variant="danger"
        onPress={() =>
          thought.status === "archived"
            ? Alert.alert("Delete permanently?", "This cannot be undone.", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => void deleteThought(thought.id, true).then(() => router.back()) }])
            : deleteThought(thought.id)
        }
      />
    </ScreenContainer>
  );
}

function BackHeader({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
        <ArrowLeft size={20} color={theme.colors.text} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md, marginBottom: theme.spacing.lg },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, alignItems: "center", justifyContent: "center" },
  title: { color: theme.colors.text, fontSize: 26, fontWeight: "900" },
  card: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, padding: theme.spacing.lg, gap: theme.spacing.md, marginBottom: theme.spacing.lg },
  input: { minHeight: 120, color: theme.colors.text, fontSize: 18, fontWeight: "700", lineHeight: 25, textAlignVertical: "top" },
  meta: { gap: theme.spacing.xs },
  metaText: { color: theme.colors.textSubtle, fontSize: 12, fontWeight: "600" },
  section: { color: theme.colors.text, fontSize: 20, fontWeight: "900", marginBottom: theme.spacing.md },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
  typeButton: { borderRadius: 999, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm },
  typeButtonActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  typeText: { color: theme.colors.textMuted, fontWeight: "800" },
  typeTextActive: { color: theme.colors.surface },
  reminderRow: { flexDirection: "row", gap: theme.spacing.md },
  smallInput: { flex: 1, minHeight: 46, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: theme.spacing.md, color: theme.colors.text },
  hint: { color: theme.colors.textMuted, fontSize: 13 },
  actions: { flexDirection: "row", gap: theme.spacing.md, marginBottom: theme.spacing.md },
  flex: { flex: 1 },
});

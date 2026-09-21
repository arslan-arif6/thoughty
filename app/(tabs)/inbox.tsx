import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { ThoughtList } from "@/components/thoughts/ThoughtList";
import { theme } from "@/theme/theme";
import { thoughtTypes, ThoughtType } from "@/types/thought";
import { useSearchResults } from "@/hooks/useThoughts";

const filters: Array<ThoughtType | "all" | "archived"> = ["all", ...thoughtTypes, "archived"];

export default function InboxScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ThoughtType | "all" | "archived">("all");
  const results = useSearchResults(query, filter);
  return (
    <ScreenContainer scroll={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Brain Inbox</Text>
        <TextInput accessibilityLabel="Search thoughts" placeholder="Search your thoughts..." placeholderTextColor={theme.colors.textSubtle} value={query} onChangeText={setQuery} style={styles.search} />
        <View style={styles.chips}>
          {filters.map((item) => (
            <Pressable key={item} onPress={() => setFilter(item)} style={[styles.chip, filter === item && styles.chipActive]}>
              <Text style={[styles.chipText, filter === item && styles.chipTextActive]}>{item === "all" ? "All" : item[0].toUpperCase() + item.slice(1)}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <ThoughtList thoughts={results} emptyTitle="Your mind is clear." emptyMessage="Capture something before you forget it." />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { padding: theme.spacing.lg, paddingBottom: 0, gap: theme.spacing.md },
  title: { color: theme.colors.text, fontSize: 30, fontWeight: "900" },
  search: { minHeight: 48, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text, paddingHorizontal: theme.spacing.lg, fontSize: 15 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  chip: { borderRadius: 999, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm },
  chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipText: { color: theme.colors.textMuted, fontWeight: "800", fontSize: 12 },
  chipTextActive: { color: theme.colors.surface },
});

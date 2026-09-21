import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { Thought } from "@/types/thought";
import { ThoughtCard } from "./ThoughtCard";
import { EmptyState } from "@/components/common/EmptyState";
import { theme } from "@/theme/theme";

export function ThoughtList({ thoughts, emptyTitle, emptyMessage }: { thoughts: Thought[]; emptyTitle: string; emptyMessage: string }) {
  return (
    <FlatList
      data={thoughts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ThoughtCard thought={item} />}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<EmptyState title={emptyTitle} message={emptyMessage} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xxl },
});

import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { ThoughtCard } from "@/components/thoughts/ThoughtCard";
import { EmptyState } from "@/components/common/EmptyState";
import { AppButton } from "@/components/common/AppButton";
import { theme } from "@/theme/theme";
import { useThoughts } from "@/hooks/useThoughts";

export default function ArchiveScreen() {
  const { thoughts, clearArchive } = useThoughts();
  const archived = thoughts.filter((thought) => thought.status === "archived");
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Archive</Text>
        {archived.length ? <AppButton label="Clear" variant="danger" onPress={() => Alert.alert("Clear archive?", "Archived thoughts will be permanently deleted.", [{ text: "Cancel", style: "cancel" }, { text: "Clear", style: "destructive", onPress: clearArchive }])} /> : null}
      </View>
      {archived.length ? archived.map((thought) => <ThoughtCard key={thought.id} thought={thought} />) : <EmptyState title="Nothing archived." message="Archived thoughts will appear here." />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: theme.spacing.lg },
  title: { color: theme.colors.text, fontSize: 30, fontWeight: "900" },
});

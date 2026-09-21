import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/theme/theme";

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginTop: theme.spacing.xl, marginBottom: theme.spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: theme.colors.text, fontSize: 20, fontWeight: "800" },
});

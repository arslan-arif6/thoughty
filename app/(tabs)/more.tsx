import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Archive, Bell, RotateCcw, Settings } from "lucide-react-native";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { theme } from "@/theme/theme";

const items = [
  { label: "Reminders", path: "/reminders", icon: Bell },
  { label: "Review", path: "/review", icon: RotateCcw },
  { label: "Archive", path: "/archive", icon: Archive },
  { label: "Settings", path: "/settings", icon: Settings },
] as const;

export default function MoreScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>More</Text>
      <View style={styles.list}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Pressable key={item.label} accessibilityRole="button" accessibilityLabel={`Open ${item.label}`} onPress={() => router.push(item.path)} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
              <View style={styles.icon}><Icon size={20} color={theme.colors.primary} /></View>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          );
        })}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: theme.colors.text, fontSize: 30, fontWeight: "900", marginBottom: theme.spacing.lg },
  list: { gap: theme.spacing.md },
  row: { minHeight: 64, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.md, flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
  icon: { width: 38, height: 38, borderRadius: theme.radius.md, backgroundColor: theme.colors.primarySoft, alignItems: "center", justifyContent: "center" },
  label: { flex: 1, color: theme.colors.text, fontWeight: "800", fontSize: 16 },
  arrow: { color: theme.colors.primary, fontSize: 20, fontWeight: "900" },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
});

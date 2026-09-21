import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { theme } from "@/theme/theme";

type Variant = "primary" | "soft" | "ghost" | "danger";

export function AppButton({ label, onPress, variant = "primary", style, disabled }: { label: string; onPress: () => void; variant?: Variant; style?: ViewStyle; disabled?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.base, styles[variant], disabled && styles.disabled, pressed && styles.pressed, style]}>
      <Text style={[styles.label, variant === "primary" ? styles.primaryLabel : styles.softLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 44, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.lg, alignItems: "center", justifyContent: "center" },
  primary: { backgroundColor: theme.colors.primary },
  soft: { backgroundColor: theme.colors.primarySoft },
  ghost: { backgroundColor: theme.colors.surfaceMuted },
  danger: { backgroundColor: theme.colors.dangerSoft },
  label: { fontSize: 15, fontWeight: "700" },
  primaryLabel: { color: theme.colors.surface },
  softLabel: { color: theme.colors.text },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.85 },
  disabled: { opacity: 0.45 },
});

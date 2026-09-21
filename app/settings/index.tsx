import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/common/ScreenContainer";
import { AppButton } from "@/components/common/AppButton";
import { theme } from "@/theme/theme";
import { APP_CONFIG } from "@/constants/app";
import { notificationService } from "@/services/notifications/NotificationService";
import { useThoughts } from "@/hooks/useThoughts";

export default function SettingsScreen() {
  const [permission, setPermission] = useState("unknown");
  const { clearArchive, exportData, importData } = useThoughts();

  const refreshPermission = async () => setPermission(await notificationService.getPermissions());
  useEffect(() => {
    void refreshPermission();
  }, []);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Notifications</Text>
        <Text style={styles.value}>Status: {permission}</Text>
        <AppButton label="Request permission" onPress={() => void notificationService.requestPermissions().then(refreshPermission)} variant="soft" />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Data</Text>
        <View style={styles.row}>
          <AppButton label="Export data" onPress={exportData} style={styles.flex} />
          <AppButton label="Import data" onPress={importData} variant="soft" style={styles.flex} />
        </View>
        <AppButton label="Clear archived items" variant="danger" onPress={() => Alert.alert("Clear archive?", "Archived thoughts will be permanently deleted.", [{ text: "Cancel", style: "cancel" }, { text: "Clear", style: "destructive", onPress: clearArchive }])} />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>AI features</Text>
        <Text style={styles.value}>Coming later: transcription, cleanup, categorization, and semantic search.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>About</Text>
        <Text style={styles.value}>{APP_CONFIG.name} {APP_CONFIG.version}</Text>
        <Text style={styles.value}>All core V1 data stays on this device.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { color: theme.colors.text, fontSize: 30, fontWeight: "900", marginBottom: theme.spacing.lg },
  card: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, padding: theme.spacing.lg, marginBottom: theme.spacing.md, gap: theme.spacing.md },
  label: { color: theme.colors.text, fontSize: 18, fontWeight: "900" },
  value: { color: theme.colors.textMuted, fontSize: 14, lineHeight: 20 },
  row: { flexDirection: "row", gap: theme.spacing.md },
  flex: { flex: 1 },
});

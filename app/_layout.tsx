import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThoughtsProvider } from "@/context/ThoughtsContext";
import { FeedbackToast } from "@/components/common/FeedbackToast";
import { theme } from "@/theme/theme";

export default function RootLayout() {
  return (
    <ThoughtsProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="thought/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="reminders/index" />
        <Stack.Screen name="review/index" />
        <Stack.Screen name="archive/index" />
        <Stack.Screen name="settings/index" />
      </Stack>
      <FeedbackToast />
    </ThoughtsProvider>
  );
}

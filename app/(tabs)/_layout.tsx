import React from "react";
import { Tabs } from "expo-router";
import { Home, Inbox, Lightbulb, ListTodo, MoreHorizontal } from "lucide-react-native";
import { theme } from "@/theme/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSubtle,
        tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border, height: 64, paddingTop: 8 },
        tabBarLabelStyle: { fontWeight: "700", fontSize: 12 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
      <Tabs.Screen name="inbox" options={{ title: "Inbox", tabBarIcon: ({ color, size }) => <Inbox color={color} size={size} /> }} />
      <Tabs.Screen name="tasks" options={{ title: "Tasks", tabBarIcon: ({ color, size }) => <ListTodo color={color} size={size} /> }} />
      <Tabs.Screen name="ideas" options={{ title: "Ideas", tabBarIcon: ({ color, size }) => <Lightbulb color={color} size={size} /> }} />
      <Tabs.Screen name="more" options={{ title: "More", tabBarIcon: ({ color, size }) => <MoreHorizontal color={color} size={size} /> }} />
    </Tabs>
  );
}

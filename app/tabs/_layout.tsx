import React from "react";
import { Tabs } from "expo-router";
import { Menu } from "lucide-react-native";
import colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: 'none' }, // Hide the tab bar
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 22,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "MITRE ATT&CK",
          headerRight: () => (
            <Menu
              size={24}
              color={colors.text}
              style={{ marginRight: 16 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="topic"
        options={{
          title: "Translation Card",
          headerRight: () => (
            <Menu
              size={24}
              color={colors.text}
              style={{ marginRight: 16 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "My Learning",
          headerRight: () => (
            <Menu
              size={24}
              color={colors.text}
              style={{ marginRight: 16 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}

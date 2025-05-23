import React from "react";
import { Tabs } from "expo-router";
import React from "react";
import { Tabs } from "expo-router";
import { Menu } from "lucide-react-native";
import { MaterialIcons } from '@expo/vector-icons'; // Assuming MaterialIcons is available
import colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // tabBarStyle: { display: 'none' }, // Commented out to show the tab bar
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
          title: "Random",
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
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="topic"
        options={{
          title: "Topic Details", // Changed title for clarity
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

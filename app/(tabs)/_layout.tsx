import { Colors } from "@/constants/design-tokens";
import AuthChecker from "@/services/auth/AuthChecker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <>
      <AuthChecker />
      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: {
          bottom: 16,
          marginHorizontal: 16,
          height: 52,
          borderRadius: 35,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        },
        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              borderRadius: 35,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "rgba(255, 255, 254, 0.3)",
            }}
          >
            <BlurView
              intensity={70}
              tint="dark"
              style={{
                flex: 1,
                backgroundColor: "rgba(36, 35, 35, 0.95)",
              }}
            />
          </View>
        ),
      }}
    >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />

        <Tabs.Screen name="rooms" options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="group" color={color} />
          ),
        }} />

        <Tabs.Screen name="storage" options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="folder" color={color} />
          ),
        }} />

        <Tabs.Screen
          name="profile"
          options={{
            href: null, 
          }}
        />
        <Tabs.Screen
          name="search/connections-search"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}

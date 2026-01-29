import { Colors } from "@/constants/design-tokens";
import AuthChecker from "@/services/auth/AuthChecker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <>
      <AuthChecker />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.inactive,
            borderTopWidth: 0,
            elevation: 0,
          },
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
        <Tabs.Screen
          name="profile"
          options={{
            href: null, 
          }}
        />
      </Tabs>
    </>
  );
}

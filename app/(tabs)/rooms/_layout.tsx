import { Stack } from "expo-router";

export default function RoomsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="room-placeholder" />
      <Stack.Screen name="[roomId]" />
    </Stack>
  );
}

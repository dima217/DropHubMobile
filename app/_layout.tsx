import { useThemeColors } from "@/hooks/useThemeColors";
import { NetworkProvider, useNetwork } from "@/providers/NetworkProvider";
import { PushNotificationsController } from "@/providers/PushNotificationsController";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { persistor, store } from "@/store/store";
import { NoInternetScreen } from "@/widgets/internet/NoInternetScreen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

function LayoutContent() {
  const { networkError } = useNetwork();
  const colors = useThemeColors();

  if (networkError) {
    return <NoInternetScreen />;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NetworkProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <PushNotificationsController />
              <LayoutContent />
              <StatusBar style="auto" />
            </PersistGate>
          </Provider>
        </NetworkProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

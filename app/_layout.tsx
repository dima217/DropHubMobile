import { Colors } from "@/constants/design-tokens";
import { NetworkProvider, useNetwork } from "@/providers/NetworkProvider";
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

  if (networkError) {
    return <NoInternetScreen />;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: Colors.background,
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
      <NetworkProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <LayoutContent />
            <StatusBar style="auto" />
          </PersistGate>
        </Provider>
      </NetworkProvider>
    </GestureHandlerRootView>
  );
}

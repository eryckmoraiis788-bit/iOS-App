import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { NotificationStoreProvider } from "@/lib/notification-store";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
      <NotificationStoreProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
        </NotificationStoreProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

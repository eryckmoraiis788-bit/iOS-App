import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { NotificationStoreProvider } from "@/lib/notification-store";
import { AppErrorBoundary } from "@/components/app-error-boundary";

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
      <NotificationStoreProvider>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
        </NotificationStoreProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}

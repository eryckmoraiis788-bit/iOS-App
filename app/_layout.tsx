import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@/lib/theme-provider";
import { NotificationStoreProvider } from "@/lib/notification-store";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NotificationStoreProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </NotificationStoreProvider>
    </ThemeProvider>
  );
}

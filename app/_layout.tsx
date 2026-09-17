import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { NotificationStoreProvider } from "@/lib/notification-store";
import { AppErrorBoundary } from "@/components/app-error-boundary";
import { LocalAuthProvider, useLocalAuth } from "@/lib/local-auth-context";
import { ActivityIndicator, View } from "react-native";

function ProtectedNavigation() {
  const { user, loading } = useLocalAuth();
  if (loading) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#EAF4F8" }}><ActivityIndicator size="large" color="#0E8278" /></View>;
  return <Stack screenOptions={{ headerShown: false }}>
    {!user ? <Stack.Screen name="login" /> : <><Stack.Screen name="(tabs)" /><Stack.Screen name="admin" /></>}
  </Stack>;
}

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
      <LocalAuthProvider>
        <NotificationStoreProvider>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <ProtectedNavigation />
        </NotificationStoreProvider>
      </LocalAuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </AppErrorBoundary>
  );
}

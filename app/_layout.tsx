import { Redirect, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";
import { ThemeProvider } from "@/lib/theme-provider";
import { NotificationStoreProvider } from "@/lib/notification-store";
import { AppErrorBoundary } from "@/components/app-error-boundary";
import { LocalAuthProvider, useLocalAuth } from "@/lib/local-auth-context";

function ProtectedNavigation() {
  const { user, loading } = useLocalAuth();
  const segments = useSegments();
  const currentRoute = segments[0];

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#EAF4F8" }}>
        <ActivityIndicator size="large" color="#0E8278" />
      </View>
    );
  }

  if (!user && currentRoute !== "login") return <Redirect href="/login" />;
  if (user && currentRoute === "login") return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
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

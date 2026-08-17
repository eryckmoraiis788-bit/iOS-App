import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 8 : Math.max(insets.bottom, 8);
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.tint,
      tabBarInactiveTintColor: "#667580",
      tabBarButton: HapticTab,
      tabBarStyle: { position: "relative", height: 64 + bottomPadding, paddingTop: 8, paddingBottom: bottomPadding, backgroundColor: "#FFFFFF", borderTopColor: "#D4E0E5", borderTopWidth: 1 },
      tabBarLabelStyle: { fontSize: 12, fontWeight: "700" },
      tabBarHideOnKeyboard: true,
    }}>
      <Tabs.Screen name="index" options={{ title: "Compor", tabBarIcon: ({ color }) => <IconSymbol name="square.and.pencil" size={25} color={color} /> }} />
      <Tabs.Screen name="history" options={{ title: "Histórico", tabBarIcon: ({ color }) => <IconSymbol name="clock.arrow.circlepath" size={25} color={color} /> }} />
      <Tabs.Screen name="schedule" options={{ title: "Agendar", tabBarIcon: ({ color }) => <IconSymbol name="calendar.badge.clock" size={25} color={color} /> }} />
      <Tabs.Screen name="templates" options={{ title: "Modelos", tabBarIcon: ({ color }) => <IconSymbol name="bookmark.fill" size={25} color={color} /> }} />
      <Tabs.Screen name="icon" options={{ title: "Ícone", tabBarIcon: ({ color }) => <IconSymbol name="photo" size={25} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Ajustes", tabBarIcon: ({ color }) => <IconSymbol name="gearshape.fill" size={25} color={color} /> }} />
    </Tabs>
  );
}

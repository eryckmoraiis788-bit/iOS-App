import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = string;

const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "square.and.pencil": "edit",
  "clock.arrow.circlepath": "history",
  "calendar.badge.clock": "event",
  photo: "photo-library",
  "gearshape.fill": "settings",
  notifications: "notifications",
  image: "image",
  "check-circle": "check-circle",
  "arrow-up-right": "open-in-new",
  "trash": "delete-outline",
  "xmark": "close",
  "info": "info-outline",
  "bolt.fill": "bolt",
  "bell.fill": "notifications-active",
  "bookmark.fill": "bookmark",
} as unknown as IconMapping;

export function IconSymbol({ name, size = 24, color, style }: { name: IconSymbolName; size?: number; color: string | OpaqueColorValue; style?: StyleProp<TextStyle>; weight?: SymbolWeight }) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name] ?? "circle"} style={style} />;
}

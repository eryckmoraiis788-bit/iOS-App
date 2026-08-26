// iOS fallback for the shared icon API.
// MaterialIcons is deliberately used here instead of SymbolView because an
// unsupported SF Symbol can abort native route rendering in a release build.
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolView, type SymbolWeight } from "expo-symbols";
import type { ComponentProps } from "react";
import type { OpaqueColorValue, StyleProp, TextStyle, ViewStyle } from "react-native";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];
type NativeIconName = ComponentProps<typeof SymbolView>["name"];

const IOS_ICON_MAP: Record<string, MaterialIconName> = {
  "square.and.pencil": "edit",
  "clock.arrow.circlepath": "history",
  "calendar.badge.clock": "event-available",
  refresh: "refresh",
  calendar: "calendar-today",
  clock: "schedule",
  photo: "photo",
  image: "image",
  "gearshape.fill": "settings",
  "bell.fill": "notifications-none",
  notifications: "notifications",
  vibration: "vibration",
  "check-circle": "check-circle",
  "chevron.right": "chevron-right",
  trash: "delete-outline",
  info: "info-outline",
  "arrow-up-right": "north-east",
  "bolt.fill": "bolt",
  bookmark: "bookmark",
  "bookmark.fill": "bookmark",
  "xmark": "close",
  // These aliases are used by the receipt detail. Keep them explicit here:
  // this .ios.tsx override takes precedence over icon-symbol.tsx in the IPA.
  "arrow-back": "arrow-back",
  "house.fill": "home",
  check: "check",
  receipt: "receipt-long",
  "paperplane.fill": "send",
  edit: "edit",
};

// These symbols are present in the iOS 15 SF Symbols set and match the old receipt.
// Keep the list intentionally small; all other app icons remain on the proven Material fallback.
const RECEIPT_SF_SYMBOLS: Record<string, NativeIconName> = {
  "arrow-back": "arrow.left",
  "house.fill": "house",
  check: "checkmark",
  receipt: "doc.text",
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const nativeName = RECEIPT_SF_SYMBOLS[name];
  if (nativeName) {
    return <SymbolView name={nativeName} size={size} tintColor={color} weight={weight ?? "regular"} style={style as StyleProp<ViewStyle>} />;
  }

  const iconName = IOS_ICON_MAP[name] ?? "help-outline";
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}

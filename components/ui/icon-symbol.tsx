import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolView, type SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, Platform, type StyleProp, type TextStyle, type ViewStyle } from "react-native";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];
type NativeIconName = ComponentProps<typeof SymbolView>["name"];
type IconSymbolName = string;

const IOS_MAPPING: Record<string, NativeIconName> = {
  "house.fill": "house",
  "paperplane.fill": "paperplane.fill",
  "chevron.left.forwardslash.chevron.right": "chevron.left.forwardslash.chevron.right",
  "chevron.right": "chevron.right",
  "square.and.pencil": "square.and.pencil",
  "clock.arrow.circlepath": "clock.arrow.circlepath",
  "calendar.badge.clock": "calendar.badge.clock",
  calendar: "calendar",
  clock: "clock",
  photo: "photo",
  "gearshape.fill": "gearshape.fill",
  notifications: "bell.fill",
  image: "photo",
  "check-circle": "checkmark.circle.fill",
  "arrow-up-right": "arrow.up.right",
  trash: "trash",
  xmark: "xmark",
  info: "info.circle",
  "bolt.fill": "bolt.fill",
  "bell.fill": "bell.fill",
  "bookmark.fill": "bookmark.fill",
  receipt: "doc.text",
  check: "checkmark",
  "arrow-back": "arrow.left",
  edit: "pencil",
};

const ANDROID_MAPPING: Record<string, MaterialIconName> = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "square.and.pencil": "edit",
  "clock.arrow.circlepath": "history",
  "calendar.badge.clock": "event",
  calendar: "calendar-today",
  clock: "schedule",
  photo: "photo-library",
  "gearshape.fill": "settings",
  notifications: "notifications",
  image: "image",
  "check-circle": "check-circle",
  "arrow-up-right": "open-in-new",
  trash: "delete-outline",
  xmark: "close",
  info: "info-outline",
  "bolt.fill": "bolt",
  "bell.fill": "notifications-active",
  "bookmark.fill": "bookmark",
  receipt: "receipt-long",
  check: "check",
  "arrow-back": "arrow-back",
  edit: "edit",
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular",
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  const nativeName = IOS_MAPPING[name];
  if (Platform.OS === "ios" && nativeName) {
    return <SymbolView name={nativeName} size={size} tintColor={color} weight={weight} style={style} />;
  }

  return <MaterialIcons color={color} size={size} name={ANDROID_MAPPING[name] ?? "help-outline"} style={style as StyleProp<TextStyle>} />;
}

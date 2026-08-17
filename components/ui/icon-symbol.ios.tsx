import { SymbolView, type SymbolViewProps, type SymbolWeight } from "expo-symbols";
import { StyleProp, ViewStyle } from "react-native";

/**
 * The shared app screens use a few friendly aliases so the Android/web
 * MaterialIcons fallback can render them. iOS must receive real SF Symbol
 * names, otherwise SymbolView can fail while rendering the screen.
 */
const IOS_SYMBOLS: Record<string, SymbolViewProps["name"]> = {
  "square.and.pencil": "square.and.pencil",
  "clock.arrow.circlepath": "clock.arrow.circlepath",
  "calendar.badge.clock": "calendar.badge.clock",
  photo: "photo",
  image: "photo",
  "gearshape.fill": "gearshape.fill",
  "bell.fill": "bell.fill",
  notifications: "bell.badge.fill",
  vibration: "waveform",
  "check-circle": "checkmark.circle.fill",
  "chevron.right": "chevron.right",
  trash: "trash",
  info: "info.circle",
  "arrow-up-right": "arrow.up.right",
  "bolt.fill": "bolt.fill",
  bookmark: "bookmark.fill",
  "bookmark.fill": "bookmark.fill",
  xmark: "xmark",
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular",
}: {
  name: string;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  const symbolName = IOS_SYMBOLS[name] ?? "questionmark.circle";

  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={symbolName}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}

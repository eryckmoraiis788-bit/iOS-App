import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Easing, Platform, View, type ViewStyle } from "react-native";

type AnimatedScreenProps = {
  children: ReactNode;
  style?: ViewStyle;
  delay?: number;
};

/**
 * Subtle screen entrance used across the app.
 *
 * iOS release builds use a fail-open static container. This avoids allowing a
 * native animation startup issue to leave an entire tab transparent while the
 * tab bar remains visible. The web preview keeps the original entrance effect.
 */
export function AnimatedScreen({ children, style, delay = 0 }: AnimatedScreenProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    if (Platform.OS === "ios") return;

    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [delay, opacity, translateY]);

  if (Platform.OS === "ios") {
    return <View style={[{ flex: 1 }, style]}>{children}</View>;
  }

  return <Animated.View style={[{ flex: 1, opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
}

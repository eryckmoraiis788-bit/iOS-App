import { StyleSheet, Text, View } from "react-native";

export default function ComposeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>COMPOSITOR</Text>
      <Text style={styles.message}>A rota Compor foi montada.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EAF4F8",
    paddingTop: 48,
    paddingHorizontal: 20,
  },
  title: {
    color: "#0E8278",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 2,
  },
  message: {
    marginTop: 16,
    color: "#121B24",
    fontSize: 24,
    fontWeight: "800",
  },
});

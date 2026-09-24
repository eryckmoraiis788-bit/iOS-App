import { StyleSheet, Text, TextInput, View } from "react-native";

type AccountFinalInputProps = {
  number: string;
  digit: string;
  onNumberChange: (value: string) => void;
  onDigitChange: (value: string) => void;
  accentColor?: string;
};

export function AccountFinalInput({ number, digit, onNumberChange, onDigitChange, accentColor = "#121B24" }: AccountFinalInputProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.fixed, { color: accentColor }]}>***</Text>
      <TextInput value={number} onChangeText={(value) => onNumberChange(value.replace(/\D/g, "").slice(0, 5))} placeholder="15448" placeholderTextColor="#87949C" style={[styles.numberInput, { color: accentColor }]} maxLength={5} keyboardType="number-pad" accessibilityLabel="Números do final da conta" />
      <Text style={[styles.fixed, { color: accentColor }]}>-</Text>
      <TextInput value={digit} onChangeText={(value) => onDigitChange(value.replace(/\D/g, "").slice(0, 1))} placeholder="3" placeholderTextColor="#87949C" style={[styles.digitInput, { color: accentColor }]} maxLength={1} keyboardType="number-pad" accessibilityLabel="Dígito do final da conta" />
      <Text style={[styles.fixed, { color: accentColor }]}>.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginTop: 12, borderWidth: 1, borderColor: "#D4E0E5", borderRadius: 18, minHeight: 56, paddingHorizontal: 14, backgroundColor: "#FCFCFC" },
  fixed: { fontSize: 17, fontWeight: "800" },
  numberInput: { flex: 1, minWidth: 0, height: 54, fontSize: 17, paddingHorizontal: 5 },
  digitInput: { width: 26, height: 54, fontSize: 17, paddingHorizontal: 4, textAlign: "center" },
});

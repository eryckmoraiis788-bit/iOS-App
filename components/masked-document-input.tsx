import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type MaskedDocumentInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholderFirst?: string;
  placeholderSecond?: string;
  accessibilityLabel?: string;
};

function partsFromValue(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 6).padEnd(6, "");
  return { first: digits.slice(0, 3), second: digits.slice(3, 6) };
}

export function MaskedDocumentInput({ value, onChange, placeholderFirst = "000", placeholderSecond = "000", accessibilityLabel = "CPF ou CNPJ mascarado" }: MaskedDocumentInputProps) {
  const initial = partsFromValue(value);
  const [first, setFirst] = useState(initial.first);
  const [second, setSecond] = useState(initial.second);

  useEffect(() => {
    const next = partsFromValue(value);
    setFirst(next.first);
    setSecond(next.second);
  }, [value]);

  const update = (nextFirst: string, nextSecond: string) => {
    const firstDigits = nextFirst.replace(/\D/g, "").slice(0, 3);
    const secondDigits = nextSecond.replace(/\D/g, "").slice(0, 3);
    setFirst(firstDigits);
    setSecond(secondDigits);
    onChange(`***.${firstDigits}.${secondDigits}-**`);
  };

  return (
    <View style={styles.row} accessibilityLabel={accessibilityLabel}>
      <Text style={styles.fixed}>***.</Text>
      <TextInput
        value={first}
        onChangeText={(text) => update(text, second)}
        placeholder={placeholderFirst}
        placeholderTextColor="#87949C"
        style={styles.numberInput}
        maxLength={3}
        keyboardType="number-pad"
        selectTextOnFocus={false}
      />
      <Text style={styles.fixed}>.</Text>
      <TextInput
        value={second}
        onChangeText={(text) => update(first, text)}
        placeholder={placeholderSecond}
        placeholderTextColor="#87949C"
        style={styles.numberInput}
        maxLength={3}
        keyboardType="number-pad"
        selectTextOnFocus={false}
      />
      <Text style={styles.fixed}>-**</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: "100%", height: 48, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#D4E0E5", borderRadius: 14, paddingHorizontal: 12, backgroundColor: "#FCFCFC", marginTop: 8 },
  fixed: { color: "#121B24", fontSize: 13, fontWeight: "500" },
  numberInput: { width: 34, height: 46, paddingHorizontal: 2, color: "#121B24", fontSize: 13, textAlign: "center" },
});

import { useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { useLocalAuth } from "@/lib/local-auth-context";

export default function LoginScreen() {
  const { signIn } = useLocalAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    Keyboard.dismiss();
    if (!username.trim() || !password) { setError("Informe usuário e senha."); return; }
    setSubmitting(true); setError("");
    try { await signIn(username, password, licenseKey); }
    catch (e) { setError(e instanceof Error ? e.message : "Não foi possível entrar."); }
    finally { setSubmitting(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" showsVerticalScrollIndicator={false}>
          <View style={styles.brand}>
            <Text style={styles.logo}>N</Text>
            <Text style={styles.eyebrow}>ACESSO PROTEGIDO</Text>
            <Text style={styles.title}>Entrar no aplicativo</Text>
            <Text style={styles.subtitle}>Use o usuário e a senha fornecidos pelo proprietário.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Usuário</Text>
            <TextInput value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} placeholder="Digite seu usuário" placeholderTextColor="#87949C" style={styles.input} returnKeyType="next" blurOnSubmit={false} />
            <Text style={styles.label}>Senha</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" autoCorrect={false} placeholder="Digite sua senha" placeholderTextColor="#87949C" style={styles.input} returnKeyType="next" blurOnSubmit={false} />
            <Text style={styles.label}>Chave de licença</Text>
            <Text style={styles.help}>Cole a chave recebida do proprietário. Para o proprietário, deixe este campo vazio.</Text>
            <TextInput value={licenseKey} onChangeText={setLicenseKey} autoCapitalize="characters" autoCorrect={false} placeholder="Ex.: A1B2-C3D4-E5F6-7890" placeholderTextColor="#87949C" style={styles.input} returnKeyType="done" onSubmitEditing={() => void submit()} />
            {!!error && <Text style={styles.error}>{error}</Text>}
            <Pressable onPress={() => void submit()} disabled={submitting} style={({ pressed }) => [styles.button, pressed && styles.pressed, submitting && styles.disabled]}>
              {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
            </Pressable>
            <Text style={styles.footnote}>Toque fora do campo ou use “Concluir” no teclado para escondê-lo. O acesso é vinculado a um único dispositivo e bloqueado após o vencimento da licença.</Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#EAF4F8" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 22 },
  brand: { alignItems: "center", marginBottom: 28 },
  logo: { width: 66, height: 66, borderRadius: 22, backgroundColor: "#0E8278", color: "#FFF", fontSize: 40, lineHeight: 66, textAlign: "center", fontWeight: "900", marginBottom: 18 },
  eyebrow: { color: "#0E8278", letterSpacing: 2.5, fontSize: 11, fontWeight: "900" },
  title: { color: "#121B24", fontSize: 30, fontWeight: "900", marginTop: 8, textAlign: "center" },
  subtitle: { color: "#667580", fontSize: 15, lineHeight: 21, textAlign: "center", marginTop: 8, maxWidth: 320 },
  card: { backgroundColor: "#FFF", borderRadius: 26, borderWidth: 1, borderColor: "#D4E0E5", padding: 20, shadowColor: "#9DB5BC", shadowOpacity: 0.15, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  label: { color: "#121B24", fontSize: 14, fontWeight: "800", marginBottom: 7, marginTop: 8 },
  help: { color: "#667580", fontSize: 12, lineHeight: 17, marginBottom: 6 },
  input: { height: 52, borderWidth: 1, borderColor: "#D4E0E5", borderRadius: 15, paddingHorizontal: 14, color: "#121B24", fontSize: 16, backgroundColor: "#FCFEFE" },
  button: { height: 54, borderRadius: 16, backgroundColor: "#0E8278", alignItems: "center", justifyContent: "center", marginTop: 20 },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "900" },
  pressed: { opacity: 0.76 },
  disabled: { opacity: 0.55 },
  error: { color: "#A53E45", backgroundColor: "#FFF0F0", borderRadius: 10, padding: 10, marginTop: 14, fontSize: 13, lineHeight: 18 },
  footnote: { color: "#87949C", fontSize: 12, lineHeight: 17, textAlign: "center", marginTop: 16 },
});

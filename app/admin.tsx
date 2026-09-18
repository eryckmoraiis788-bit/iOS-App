import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { createUser, deleteUser, listUsers, updateUser, type LocalUser } from "@/lib/local-auth";

export default function AdminScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const refresh = async () => {
    try { setUsers((await listUsers()).users); }
    catch (e) { Alert.alert("Painel", e instanceof Error ? e.message : "Não foi possível carregar os usuários."); }
  };

  useEffect(() => { void refresh(); }, []);

  const create = async () => {
    try {
      const result = await createUser({ username, password, name, expiresAt });
      Alert.alert(
        "Acesso criado",
        `Envie ao usuário:\n\nUsuário: ${result.user.username}\nSenha: ${password}\nChave de licença: ${result.licenseKey}\nVálida até: ${expiresAt}\n\nA chave aparece somente agora. Salve estas informações antes de fechar.`,
      );
      setUsername(""); setPassword(""); setName(""); setExpiresAt("");
      await refresh();
    } catch (e) { Alert.alert("Não foi possível criar", e instanceof Error ? e.message : "Revise os dados."); }
  };

  const renew = (user: LocalUser) => Alert.prompt?.(
    "Renovar licença",
    "Informe a nova data no formato AAAA-MM-DD",
    async (value) => {
      if (!value) return;
      try { await updateUser(user.id, { expiresAt: value, status: "active" }); await refresh(); }
      catch (e) { Alert.alert("Erro", e instanceof Error ? e.message : "Não foi possível renovar."); }
    },
  );

  const remove = (user: LocalUser) => Alert.alert(
    "Excluir acesso?",
    `O usuário ${user.username} perderá o acesso imediatamente. Esta ação não pode ser desfeita.`,
    [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => {
        try { await deleteUser(user.id); await refresh(); }
        catch (e) { Alert.alert("Erro", e instanceof Error ? e.message : "Não foi possível excluir o usuário."); }
      } },
    ],
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()}><Text style={styles.back}>‹ Voltar</Text></Pressable>
      <Text style={styles.eyebrow}>ÁREA DO PROPRIETÁRIO</Text>
      <Text style={styles.heading}>Controle de acessos</Text>
      <Text style={styles.subtitle}>Crie um login para cada pessoa. Depois de salvar, envie a ela o usuário, a senha e a chave de licença.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Novo acesso</Text>
        <Text style={styles.cardIntro}>Preencha os quatro campos abaixo para criar o acesso de um novo usuário.</Text>

        <Text style={styles.label}>Nome da pessoa (opcional)</Text>
        <Text style={styles.help}>É apenas uma identificação para você no painel. Não é usado como login.</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Ex.: João da Silva" placeholderTextColor="#87949C" style={styles.input} />

        <Text style={styles.label}>Usuário ou login</Text>
        <Text style={styles.help}>É o nome que a pessoa digitará na tela de entrada. Exemplo: joao.silva</Text>
        <TextInput value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} placeholder="Ex.: joao.silva" placeholderTextColor="#87949C" style={styles.input} />

        <Text style={styles.label}>Senha do usuário</Text>
        <Text style={styles.help}>Crie uma senha com pelo menos 8 caracteres e envie-a junto com o login.</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Ex.: SenhaForte2026!" placeholderTextColor="#87949C" style={styles.input} />

        <Text style={styles.label}>Data de vencimento</Text>
        <Text style={styles.help}>Até essa data o acesso ficará ativo. Use exatamente o formato ano-mês-dia.</Text>
        <TextInput value={expiresAt} onChangeText={setExpiresAt} keyboardType="numbers-and-punctuation" placeholder="Ex.: 2026-12-31" placeholderTextColor="#87949C" style={styles.input} />

        <View style={styles.summary}><Text style={styles.summaryTitle}>O usuário receberá:</Text><Text style={styles.summaryText}>1. Usuário/login</Text><Text style={styles.summaryText}>2. Senha</Text><Text style={styles.summaryText}>3. Chave de licença</Text></View>
        <Pressable onPress={() => void create()} style={styles.primary}><Text style={styles.primaryText}>Gerar acesso e chave</Text></Pressable>
      </View>

      <Text style={styles.section}>USUÁRIOS AUTORIZADOS ({users.length})</Text>
      {users.map((user) => (
        <View key={user.id} style={styles.userCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user.name || user.username}</Text>
            <Text style={styles.userMeta}>Login: @{user.username} · {user.deviceBound ? "dispositivo vinculado" : "aguardando primeiro acesso"}</Text>
            <Text style={[styles.userMeta, user.licenseStatus === "revoked" && styles.revoked]}>Até {user.licenseExpiresAt ? new Date(user.licenseExpiresAt).toLocaleDateString("pt-BR") : "sem vencimento"} · {user.licenseStatus === "active" ? "ativa" : "revogada"}</Text>
          </View>
          <Pressable onPress={() => renew(user)} style={styles.small}><Text style={styles.smallText}>Renovar</Text></Pressable>
          <Pressable onPress={async () => { await updateUser(user.id, { status: user.licenseStatus === "active" ? "revoked" : "active" }); await refresh(); }} style={[styles.small, styles.revoke]}><Text style={styles.smallText}>{user.licenseStatus === "active" ? "Bloquear" : "Ativar"}</Text></Pressable>
          <Pressable onPress={() => remove(user)} style={[styles.small, styles.deleteButton]}><Text style={styles.deleteText}>Excluir</Text></Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { backgroundColor: "#EAF4F8", padding: 20, paddingBottom: 60, gap: 14, flexGrow: 1 },
  back: { color: "#0E8278", fontSize: 16, fontWeight: "800", marginBottom: 8 },
  eyebrow: { color: "#0E8278", letterSpacing: 2.5, fontSize: 11, fontWeight: "900" },
  heading: { color: "#121B24", fontSize: 30, fontWeight: "900" },
  subtitle: { color: "#667580", fontSize: 14, lineHeight: 20, marginBottom: 8 },
  card: { backgroundColor: "#FFF", borderRadius: 22, padding: 16, borderWidth: 1, borderColor: "#D4E0E5", gap: 7 },
  cardTitle: { color: "#121B24", fontSize: 18, fontWeight: "900" },
  cardIntro: { color: "#667580", fontSize: 13, lineHeight: 18, marginBottom: 5 },
  label: { color: "#121B24", fontSize: 14, fontWeight: "900", marginTop: 7 },
  help: { color: "#667580", fontSize: 12, lineHeight: 17 },
  input: { height: 48, borderWidth: 1, borderColor: "#D4E0E5", borderRadius: 13, paddingHorizontal: 12, color: "#121B24", backgroundColor: "#FCFEFE", marginBottom: 3 },
  summary: { backgroundColor: "#EAF4F8", borderRadius: 13, padding: 12, marginTop: 8, gap: 3 },
  summaryTitle: { color: "#102F49", fontSize: 13, fontWeight: "900", marginBottom: 2 },
  summaryText: { color: "#667580", fontSize: 12 },
  primary: { height: 50, borderRadius: 14, backgroundColor: "#0E8278", alignItems: "center", justifyContent: "center", marginTop: 7 },
  primaryText: { color: "#FFF", fontWeight: "900" },
  section: { color: "#667580", letterSpacing: 2, fontSize: 11, fontWeight: "900", marginTop: 10 },
  userCard: { backgroundColor: "#FFF", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "#D4E0E5", flexDirection: "row", alignItems: "center", gap: 7 },
  userName: { color: "#121B24", fontSize: 16, fontWeight: "900" },
  userMeta: { color: "#667580", fontSize: 12, marginTop: 3 },
  revoked: { color: "#A53E45" },
  small: { backgroundColor: "#E5F5F2", paddingHorizontal: 9, paddingVertical: 8, borderRadius: 9 },
  smallText: { color: "#0E8278", fontSize: 11, fontWeight: "900" },
  revoke: { backgroundColor: "#FFF0EF" },
  deleteButton: { backgroundColor: "#FCE4E4" },
  deleteText: { color: "#A53E45", fontSize: 11, fontWeight: "900" },
});

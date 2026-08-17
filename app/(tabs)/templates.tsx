import { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScreenContainer } from "@/components/screen-container";
import { useNotificationStore, type NotificationTemplate } from "@/lib/notification-store";

const colors = {
  bg: "#EAF4F8",
  ink: "#121B24",
  muted: "#667580",
  teal: "#0E8278",
  tealLight: "#B5DCD8",
  navy: "#102F49",
  white: "#FFFFFF",
  border: "#D4E0E5",
};

type FormState = { name: string; title: string; subtitle: string; body: string };
const emptyForm: FormState = { name: "", title: "", subtitle: "", body: "" };

export default function TemplatesScreen() {
  const router = useRouter();
  const { templates, saveTemplate, removeTemplate } = useNotificationStore();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string>();

  const canSave = useMemo(() => form.name.trim().length > 0 && form.title.trim().length > 0 && form.body.trim().length > 0, [form]);

  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    if (!canSave) {
      Alert.alert("Complete o modelo", "Informe o nome do modelo, o título e a mensagem.");
      return;
    }
    try {
      await saveTemplate({ name: form.name.trim(), title: form.title.trim(), subtitle: form.subtitle.trim(), body: form.body.trim() }, editingId);
      setForm(emptyForm);
      setEditingId(undefined);
      Alert.alert("Modelo salvo", "O modelo está disponível na lista e ficará salvo neste iPhone.");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Não foi possível gravar o modelo no armazenamento local.";
      Alert.alert("Não foi possível salvar", detail);
    }
  };

  const handleEdit = (template: NotificationTemplate) => {
    setEditingId(template.id);
    setForm({ name: template.name, title: template.title, subtitle: template.subtitle, body: template.body });
  };

  const handleUse = (template: NotificationTemplate) => {
    router.push({ pathname: "/", params: { templateTitle: template.title, templateSubtitle: template.subtitle, templateBody: template.body } });
  };

  const handleDelete = (template: NotificationTemplate) => {
    Alert.alert("Excluir modelo?", `O modelo “${template.name}” será removido.`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => void removeTemplate(template) },
    ]);
  };

  const renderItem = ({ item }: { item: NotificationTemplate }) => (
    <View style={styles.templateCard}>
      <View style={styles.templateIcon}><MaterialIcons name="bookmark" size={26} color={colors.teal} /></View>
      <View style={styles.templateCopy}>
        <Text style={styles.templateName}>{item.name}</Text>
        <Text style={styles.templateTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.templateBody} numberOfLines={2}>{item.body}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Usar ${item.name}`} onPress={() => handleUse(item)} style={styles.useButton}>
          <Text style={styles.useText}>Usar</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={`Editar ${item.name}`} onPress={() => handleEdit(item)} hitSlop={8}>
          <MaterialIcons name="edit" size={21} color={colors.muted} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={`Excluir ${item.name}`} onPress={() => handleDelete(item)} hitSlop={8}>
          <MaterialIcons name="delete-outline" size={22} color="#B74D57" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.headerIcon}><MaterialIcons name="bookmark" size={30} color={colors.white} /></View>
              <View style={styles.headerCopy}>
                <Text style={styles.eyebrow}>BIBLIOTECA</Text>
                <Text style={styles.heading}>Modelos predefinidos</Text>
              </View>
            </View>
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>Salve uma notificação para usar de novo.</Text>
              <Text style={styles.heroBody}>Crie modelos prontos e preencha a tela Compor em um toque.</Text>
            </View>
            <View style={styles.formCard}>
              <View style={styles.sectionRow}><Text style={styles.sectionTitle}>{editingId ? "Editar modelo" : "Novo modelo"}</Text>{editingId ? <Pressable onPress={() => { setEditingId(undefined); setForm(emptyForm); }}><Text style={styles.cancelText}>Cancelar</Text></Pressable> : null}</View>
              <TextInput value={form.name} onChangeText={(value) => update("name", value)} placeholder="Nome do modelo" placeholderTextColor="#8A969C" style={styles.input} maxLength={40} />
              <TextInput value={form.title} onChangeText={(value) => update("title", value)} placeholder="Título da notificação" placeholderTextColor="#8A969C" style={styles.input} maxLength={40} />
              <TextInput value={form.subtitle} onChangeText={(value) => update("subtitle", value)} placeholder="Subtítulo (opcional)" placeholderTextColor="#8A969C" style={styles.input} maxLength={80} />
              <TextInput value={form.body} onChangeText={(value) => update("body", value)} placeholder="Mensagem" placeholderTextColor="#8A969C" style={[styles.input, styles.bodyInput]} multiline maxLength={140} />
              <Pressable onPress={handleSave} style={({ pressed }) => [styles.saveButton, canSave ? styles.saveReady : styles.saveDisabled, pressed && styles.pressed]}>
                <MaterialIcons name={editingId ? "check" : "bookmark-add"} size={23} color={colors.white} />
                <Text style={styles.saveText}>{editingId ? "Atualizar modelo" : "Salvar modelo"}</Text>
              </Pressable>
            </View>
            <View style={styles.listHeading}><Text style={styles.sectionTitle}>Seus modelos</Text><Text style={styles.count}>{templates.length}</Text></View>
          </>
        }
        ListEmptyComponent={<View style={styles.empty}><MaterialIcons name="bookmark-border" size={40} color={colors.teal} /><Text style={styles.emptyTitle}>Nenhum modelo salvo</Text><Text style={styles.emptyBody}>Crie seu primeiro modelo acima para reutilizar notificações.</Text></View>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 36, backgroundColor: colors.bg },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  headerIcon: { width: 64, height: 64, borderRadius: 18, backgroundColor: "#F07C00", alignItems: "center", justifyContent: "center" },
  headerCopy: { marginLeft: 14, flex: 1 },
  eyebrow: { color: colors.teal, fontSize: 12, fontWeight: "900", letterSpacing: 3 },
  heading: { color: colors.ink, fontSize: 28, fontWeight: "900", marginTop: 2 },
  hero: { backgroundColor: colors.navy, borderRadius: 24, padding: 22, marginBottom: 18 },
  heroTitle: { color: colors.white, fontSize: 22, fontWeight: "900" },
  heroBody: { color: "#D8E4EA", fontSize: 15, lineHeight: 21, marginTop: 8 },
  formCard: { backgroundColor: colors.white, borderRadius: 22, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 22 },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { color: colors.ink, fontSize: 21, fontWeight: "900" },
  cancelText: { color: colors.teal, fontWeight: "800" },
  input: { minHeight: 50, borderRadius: 15, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 15, color: colors.ink, fontSize: 16, marginBottom: 10, backgroundColor: "#FCFDFD" },
  bodyInput: { minHeight: 82, textAlignVertical: "top", paddingTop: 14 },
  saveButton: { minHeight: 52, borderRadius: 17, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center" },
  saveReady: { backgroundColor: colors.teal },
  saveDisabled: { backgroundColor: colors.tealLight },
  saveText: { color: colors.white, fontWeight: "900", fontSize: 16 },
  listHeading: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  count: { color: colors.teal, fontWeight: "900", fontSize: 16 },
  templateCard: { backgroundColor: colors.white, borderRadius: 19, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 12, flexDirection: "row", alignItems: "center" },
  templateIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: "#E8F5F2", alignItems: "center", justifyContent: "center" },
  templateCopy: { flex: 1, marginHorizontal: 12 },
  templateName: { color: colors.ink, fontSize: 17, fontWeight: "900" },
  templateTitle: { color: colors.teal, fontWeight: "800", marginTop: 3 },
  templateBody: { color: colors.muted, marginTop: 2 },
  actions: { alignItems: "flex-end", gap: 10 },
  useButton: { backgroundColor: colors.teal, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  useText: { color: colors.white, fontWeight: "900" },
  empty: { alignItems: "center", backgroundColor: colors.white, borderRadius: 20, padding: 28, borderWidth: 1, borderColor: colors.border },
  emptyTitle: { color: colors.ink, fontSize: 18, fontWeight: "900", marginTop: 8 },
  emptyBody: { color: colors.muted, textAlign: "center", marginTop: 5, lineHeight: 20 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
});

void styles;

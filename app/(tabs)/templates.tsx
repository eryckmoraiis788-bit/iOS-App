import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
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

export default function TemplatesScreen() {
  const router = useRouter();
  const { templates, removeTemplate, refreshTemplates } = useNotificationStore();
  const [pendingDelete, setPendingDelete] = useState<NotificationTemplate | null>(null);

  useFocusEffect(useCallback(() => {
    void refreshTemplates();
  }, [refreshTemplates]));

  const handleEdit = (template: NotificationTemplate) => {
    router.push({ pathname: "/", params: { templateId: template.id, templateName: template.name, templateTitle: template.title, templateSubtitle: template.subtitle, templateBody: template.body } });
  };

  const handleUse = (template: NotificationTemplate) => {
    router.push({ pathname: "/", params: { templateTitle: template.title, templateSubtitle: template.subtitle, templateBody: template.body } });
  };

  const handleDelete = (template: NotificationTemplate) => {
    setPendingDelete(template);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const template = pendingDelete;
    setPendingDelete(null);
    await removeTemplate(template);
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
              <Text style={styles.heroTitle}>Seus modelos salvos, sempre à mão.</Text>
              <Text style={styles.heroBody}>A lista é alimentada pelas predefinições que você salva na aba Compor.</Text>
            </View>
            <View style={styles.listHeading}><Text style={styles.sectionTitle}>Modelos salvos</Text><Text style={styles.count}>{templates.length}</Text></View>
          </>
        }
        ListEmptyComponent={<View style={styles.empty}><MaterialIcons name="bookmark-border" size={40} color={colors.teal} /><Text style={styles.emptyTitle}>Nenhum modelo salvo</Text><Text style={styles.emptyBody}>Salve uma predefinição na aba Compor para vê-la aqui.</Text></View>}
      />
      {pendingDelete ? (
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Excluir modelo?</Text>
            <Text style={styles.confirmBody}>O modelo “{pendingDelete.name}” será removido da sua biblioteca.</Text>
            <View style={styles.confirmActions}>
              <Pressable accessibilityRole="button" accessibilityLabel="Cancelar exclusão" onPress={() => setPendingDelete(null)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Confirmar exclusão" onPress={() => void confirmDelete()} style={styles.deleteButton}>
                <Text style={styles.deleteText}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
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
  sectionTitle: { color: colors.ink, fontSize: 21, fontWeight: "900" },
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
  confirmOverlay: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(16,47,73,0.38)", alignItems: "center", justifyContent: "center", padding: 24 },
  confirmCard: { width: "100%", maxWidth: 360, backgroundColor: colors.white, borderRadius: 22, padding: 22, shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  confirmTitle: { color: colors.ink, fontSize: 21, fontWeight: "900" },
  confirmBody: { color: colors.muted, fontSize: 15, lineHeight: 21, marginTop: 8 },
  confirmActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 20 },
  cancelButton: { paddingHorizontal: 16, paddingVertical: 11, borderRadius: 12, backgroundColor: "#EAF0F2" },
  cancelText: { color: colors.ink, fontWeight: "800" },
  deleteButton: { paddingHorizontal: 18, paddingVertical: 11, borderRadius: 12, backgroundColor: "#B74D57" },
  deleteText: { color: colors.white, fontWeight: "900" },
});

void styles;

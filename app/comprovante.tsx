import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNotificationStore } from "@/lib/notification-store";
import { normalizeReceiptAmount, normalizeReceiptDocument, formatReceiptDate, formatReceiptTime } from "@/lib/receipt-utils";

const colors = {
  background: "#FFFFFF",
  ink: "#161616",
  muted: "#777777",
  orange: "#EA7900",
  green: "#00AA5B",
  line: "#E8E8E8",
  input: "#F8F8F8",
};

type EditableField = "amount" | "recipientName" | "document" | "institution";

const fieldLabels: Record<EditableField, string> = {
  amount: "Valor do comprovante",
  recipientName: "Nome de quem recebeu",
  document: "CPF/CNPJ",
  institution: "Instituição",
};

export default function ReceiptDetailScreen() {
  const router = useRouter();
  const { recordId } = useLocalSearchParams<{ recordId?: string }>();
  const { records, receipts, updateReceipt } = useNotificationStore();
  const record = records.find((item) => item.id === recordId);
  const receipt = receipts.find((item) => item.recordId === recordId);
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!record || !receipt) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-white" safeAreaClassName="bg-white" containerStyle={styles.screen}>
        <View style={styles.notFound}>
          <IconSymbol name="receipt" size={42} color={colors.orange} />
          <Text style={styles.notFoundTitle}>{record ? "Comprovante sendo preparado" : "Comprovante não encontrado"}</Text>
          <Pressable onPress={() => router.replace("/")} style={styles.backFallback} accessibilityRole="button">
            <Text style={styles.backFallbackText}>Voltar para Compor</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const receiptTimestamp = receipt.eventAt;
  const openEditor = (field: EditableField, value: string) => {
    setEditingField(field);
    setDraftValue(value);
  };

  const saveEditor = async () => {
    if (!editingField || isSaving) return;
    const nextValue = editingField === "amount"
      ? normalizeReceiptAmount(draftValue)
      : editingField === "document"
        ? normalizeReceiptDocument(draftValue)
        : draftValue.trim();
    if (!nextValue) return;
    setIsSaving(true);
    try {
      await updateReceipt(receipt.id, { [editingField]: nextValue });
      setEditingField(null);
      setDraftValue("");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-white" safeAreaClassName="bg-white" containerStyle={styles.screen}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Voltar">
            <IconSymbol name="arrow-back" size={26} color={colors.orange} />
          </Pressable>
          <Text style={styles.headerTitle}>Comprovante</Text>
          <Pressable onPress={() => router.replace("/")} hitSlop={12} accessibilityRole="button" accessibilityLabel="Ir para o início">
            <IconSymbol name="house.fill" size={26} color={colors.orange} />
          </Pressable>
        </View>

        <ScrollView style={styles.receiptScroll} contentContainerStyle={styles.receiptBody} showsVerticalScrollIndicator={false}>
          <View style={styles.successCircle}>
            <IconSymbol name="check" size={40} color={colors.background} />
          </View>
          <Text style={styles.successTitle}>Pix enviado</Text>
          <Pressable onPress={() => openEditor("amount", receipt.amount)} accessibilityRole="button" accessibilityLabel="Editar valor do comprovante" style={({ pressed }) => [styles.amountPressable, pressed && styles.pressed]}>
            <Text style={styles.amount}>R$ {receipt.amount}</Text>
          </Pressable>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre a transação</Text>
            <InfoRow label="Data do pagamento" value={formatReceiptDate(receiptTimestamp)} />
            <InfoRow label="Horário" value={formatReceiptTime(receiptTimestamp)} />
            <View style={styles.idBlock}>
              <Text style={styles.infoLabel}>ID da transação</Text>
              <Text style={styles.idValue} selectable numberOfLines={1}>{receipt.transactionId}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={[styles.section, styles.recipientSection]}>
            <Text style={styles.sectionTitle}>Quem recebeu</Text>
            <EditableInfoRow label="Nome" value={receipt.recipientName} onPress={() => openEditor("recipientName", receipt.recipientName)} />
            <EditableInfoRow label="CPF/CNPJ" value={receipt.document} onPress={() => openEditor("document", receipt.document)} />
            <EditableInfoRow label="Instituição" value={receipt.institution} onPress={() => openEditor("institution", receipt.institution)} />
          </View>

          <View style={styles.actions}>
            <View
              accessible
              accessibilityRole="button"
              accessibilityLabel="Compartilhar comprovante indisponível"
              accessibilityState={{ disabled: true }}
              style={styles.shareButton}
            >
              <Text style={styles.shareText}>Compartilhar comprovante</Text>
            </View>
            <Pressable
              onPress={() => router.replace("/")}
              accessibilityRole="button"
              accessibilityLabel="Realizar novo Pix"
              style={({ pressed }) => [styles.newPixButton, pressed && styles.pressed]}
            >
              <View pointerEvents="none" style={styles.newPixButtonSurface}>
                <Text style={styles.newPixText}>Realizar novo Pix</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </View>

      <Modal visible={editingField !== null} transparent animationType="fade" onRequestClose={() => setEditingField(null)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.editorCard}>
            <View style={styles.editorHeader}>
              <Text style={styles.editorTitle}>Editar {editingField ? fieldLabels[editingField] : "campo"}</Text>
              <Pressable onPress={() => setEditingField(null)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Fechar edição">
                <IconSymbol name="xmark" size={24} color={colors.muted} />
              </Pressable>
            </View>
            <TextInput
              autoFocus
              value={draftValue}
              onChangeText={setDraftValue}
              keyboardType={editingField === "amount" ? "decimal-pad" : "default"}
              placeholder={fieldLabels[editingField ?? "institution"]}
              placeholderTextColor={colors.muted}
              style={styles.editorInput}
              maxLength={editingField === "amount" ? 18 : 80}
              accessibilityLabel={`Campo para editar ${editingField ? fieldLabels[editingField] : "comprovante"}`}
            />
            <View style={styles.editorActions}>
              <Pressable onPress={() => setEditingField(null)} style={styles.cancelButton} accessibilityRole="button"><Text style={styles.cancelText}>Cancelar</Text></Pressable>
              <Pressable onPress={() => void saveEditor()} disabled={isSaving || !draftValue.trim()} style={[styles.saveButton, (isSaving || !draftValue.trim()) && styles.saveButtonDisabled]} accessibilityRole="button"><Text style={styles.saveText}>{isSaving ? "Salvando…" : "Salvar"}</Text></Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenContainer>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function EditableInfoRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Editar ${label}`} style={({ pressed }) => [styles.infoRow, styles.recipientRow, pressed && styles.rowPressed]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.editableValueWrap}>
        <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { height: 56, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: colors.ink, fontSize: 20, lineHeight: 24, fontWeight: "600" },
  receiptScroll: { flex: 1 },
  receiptBody: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 0, paddingBottom: 20 },
  successCircle: { alignSelf: "center", width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", backgroundColor: colors.green },
  successTitle: { color: colors.ink, fontSize: 25, lineHeight: 30, fontWeight: "600", textAlign: "center", marginTop: 16 },
  amountPressable: { alignSelf: "center", borderRadius: 8, paddingHorizontal: 8, marginHorizontal: -8 },
  amount: { color: colors.ink, fontSize: 25, lineHeight: 30, fontWeight: "600", textAlign: "center" },
  pressed: { opacity: 0.6 },
  section: { marginTop: 54 },
  sectionTitle: { color: colors.ink, fontSize: 20, lineHeight: 24, fontWeight: "600", marginBottom: 16 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 12 },
  rowPressed: { opacity: 0.62 },
  infoLabel: { color: colors.muted, fontSize: 16, lineHeight: 21, flexShrink: 0 },
  infoValue: { color: colors.ink, fontSize: 16, lineHeight: 21, fontWeight: "600", textAlign: "right", flex: 1 },
  editableValueWrap: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", flex: 1 },
  idBlock: { marginTop: 1 },
  idValue: { color: colors.ink, fontSize: 16, lineHeight: 21, fontWeight: "600", marginTop: 6 },
  separator: { height: 1, borderTopWidth: 1, borderTopColor: "#E4E4E4", borderStyle: "dashed", marginTop: 32 },
  recipientSection: { marginTop: 42 },
  actions: { width: "100%", alignItems: "stretch", marginTop: 24, paddingBottom: 12 },
  shareButton: { width: "100%", height: 48, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: "#EA7900", opacity: 1 },
  shareText: { color: colors.background, fontSize: 17, fontWeight: "600" },
  recipientRow: { marginBottom: 6 },
  newPixButton: { width: "100%", minHeight: 48, height: 48, marginTop: 13, borderRadius: 9, alignItems: "stretch", justifyContent: "center", backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: "#F2B16E", overflow: "hidden" },
  newPixButtonSurface: { flex: 1, width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
  newPixText: { color: colors.orange, fontSize: 17, fontWeight: "600", textAlign: "center" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "rgba(0, 0, 0, 0.42)" },
  editorCard: { width: "100%", maxWidth: 390, borderRadius: 20, padding: 20, backgroundColor: colors.background },
  editorHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  editorTitle: { flex: 1, color: colors.ink, fontSize: 20, fontWeight: "700" },
  editorInput: { height: 54, marginTop: 18, paddingHorizontal: 15, borderRadius: 13, borderWidth: 1, borderColor: "#D8D8D8", backgroundColor: colors.input, color: colors.ink, fontSize: 17 },
  editorActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 18 },
  cancelButton: { minWidth: 100, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#F1F1F1" },
  cancelText: { color: colors.ink, fontSize: 15, fontWeight: "700" },
  saveButton: { minWidth: 100, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.orange },
  saveButtonDisabled: { opacity: 0.5 },
  saveText: { color: colors.background, fontSize: 15, fontWeight: "700" },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30, gap: 14 },
  notFoundTitle: { color: colors.ink, fontSize: 20, fontWeight: "700", textAlign: "center" },
  backFallback: { paddingHorizontal: 20, paddingVertical: 13, borderRadius: 14, backgroundColor: colors.orange },
  backFallbackText: { color: colors.background, fontSize: 15, fontWeight: "700" },
});

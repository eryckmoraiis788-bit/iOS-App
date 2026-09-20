import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNotificationStore } from "@/lib/notification-store";
import { normalizeReceiptAmount, normalizeReceiptDocument, formatReceiptDate, formatReceiptTime } from "@/lib/receipt-utils";

const colors = {
  background: "#1D1D1F",
  panel: "#232325",
  ink: "#F5F5F7",
  muted: "#B5B5BA",
  orange: "#FF8500",
  line: "#303033",
  input: "#2A2A2D",
};

type EditableField = "amount" | "recipientName" | "document" | "institution";

const fieldLabels: Record<EditableField, string> = {
  amount: "Valor do comprovante",
  recipientName: "Nome",
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
      <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#1D1D1F]" safeAreaClassName="bg-[#1D1D1F]" containerStyle={styles.screen}>
        <View style={styles.notFound}>
          <IconSymbol name="receipt" size={42} color={colors.orange} />
          <Text style={styles.notFoundTitle}>{record ? "Comprovante sendo preparado" : "Comprovante não encontrado"}</Text>
          <Pressable onPress={() => router.replace("/")} style={styles.backFallback} accessibilityRole="button"><Text style={styles.backFallbackText}>Voltar para Compor</Text></Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const isReceivedPix = record.title.trim().toLowerCase() === "pix recebido";
  const pixTitle = record.title.trim() || (isReceivedPix ? "Pix recebido" : "Pix enviado");
  const participantLabel = isReceivedPix ? "Quem enviou" : "Quem recebeu";
  const receiptTimestamp = receipt.eventAt;

  const openEditor = (field: EditableField, value: string) => { setEditingField(field); setDraftValue(value); };

  const saveEditor = async () => {
    if (!editingField || isSaving) return;
    const nextValue = editingField === "amount" ? normalizeReceiptAmount(draftValue) : editingField === "document" ? normalizeReceiptDocument(draftValue) : draftValue.trim();
    if (!nextValue) return;
    setIsSaving(true);
    try { await updateReceipt(receipt.id, { [editingField]: nextValue }); setEditingField(null); setDraftValue(""); }
    finally { setIsSaving(false); }
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#1D1D1F]" safeAreaClassName="bg-[#1D1D1F]" containerStyle={styles.screen}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Voltar"><IconSymbol name="arrow-back" size={29} color={colors.orange} /></Pressable>
          <Text style={styles.headerTitle}>{pixTitle}</Text>
          <Pressable onPress={() => {}} hitSlop={12} accessibilityRole="button" accessibilityLabel="Ajuda"><IconSymbol name="help" size={29} color={colors.orange} /></Pressable>
        </View>

        <ScrollView style={styles.receiptScroll} contentContainerStyle={styles.receiptBody} showsVerticalScrollIndicator={false}>
          <View style={styles.directionCircle}><MaterialIcons name={isReceivedPix ? "arrow-downward" : "arrow-upward"} size={43} color={colors.ink} /></View>
          <Pressable onPress={() => openEditor("amount", receipt.amount)} accessibilityRole="button" accessibilityLabel="Editar valor do comprovante" style={({ pressed }) => [styles.amountPressable, pressed && styles.pressed]}>
            <Text style={styles.amount}>R$ {receipt.amount}</Text>
          </Pressable>
          <Text style={styles.personName}>{receipt.recipientName}</Text>
          <Pressable style={styles.categoryPill} accessibilityRole="button" accessibilityLabel="Categoria do comprovante">
            <Text style={styles.categoryText}>Sem categoria</Text>
            <IconSymbol name="edit" size={22} color="#242428" />
          </Pressable>

          <View style={styles.transactionSection}>
            <Text style={styles.sectionTitle}>Sobre a transação</Text>
            <InfoRow label="Data da transação" value={formatReceiptDate(receiptTimestamp)} allowWrap />
            <InfoRow label="Horário" value={formatReceiptTime(receiptTimestamp)} />
            <View style={styles.idBlock}>
              <Text style={styles.infoLabel}>ID da transação</Text>
              <View style={styles.idRow}><Text style={styles.idValue} selectable numberOfLines={2}>{receipt.transactionId}</Text><Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Copiar ID da transação"><MaterialIcons name="content-copy" size={27} color={colors.orange} /></Pressable></View>
            </View>
            <Pressable style={styles.descriptionLink} accessibilityRole="button" accessibilityLabel="Adicionar descrição"><Text style={styles.descriptionText}>Adicionar descrição</Text></Pressable>
          </View>

          <View style={styles.divider} accessibilityElementsHidden />

          <View style={styles.participantSection}>
            <Text style={styles.sectionTitle}>{participantLabel}</Text>
            <EditableInfoRow label="Nome" value={receipt.recipientName} onPress={() => openEditor("recipientName", receipt.recipientName)} />
            <EditableInfoRow label="CPF/CNPJ" value={receipt.document} onPress={() => openEditor("document", receipt.document)} />
            <EditableInfoRow label="Instituição" value={receipt.institution} onPress={() => openEditor("institution", receipt.institution)} isLast />
          </View>
        </ScrollView>
      </View>

      <Modal visible={editingField !== null} transparent animationType="fade" onRequestClose={() => setEditingField(null)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.editorCard}>
            <View style={styles.editorHeader}><Text style={styles.editorTitle}>Editar {editingField ? fieldLabels[editingField] : "campo"}</Text><Pressable onPress={() => setEditingField(null)} hitSlop={10} accessibilityRole="button" accessibilityLabel="Fechar edição"><IconSymbol name="xmark" size={24} color={colors.muted} /></Pressable></View>
            <TextInput autoFocus value={draftValue} onChangeText={setDraftValue} keyboardType={editingField === "amount" ? "decimal-pad" : "default"} placeholder={fieldLabels[editingField ?? "institution"]} placeholderTextColor={colors.muted} style={styles.editorInput} maxLength={editingField === "amount" ? 18 : 80} accessibilityLabel={`Campo para editar ${editingField ? fieldLabels[editingField] : "comprovante"}`} />
            <View style={styles.editorActions}><Pressable onPress={() => setEditingField(null)} style={styles.cancelButton} accessibilityRole="button"><Text style={styles.cancelText}>Cancelar</Text></Pressable><Pressable onPress={() => void saveEditor()} disabled={isSaving || !draftValue.trim()} style={[styles.saveButton, (isSaving || !draftValue.trim()) && styles.saveButtonDisabled]} accessibilityRole="button"><Text style={styles.saveText}>{isSaving ? "Salvando…" : "Salvar"}</Text></Pressable></View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenContainer>
  );
}

function InfoRow({ label, value, allowWrap = false }: { label: string; value: string; allowWrap?: boolean }) {
  return <View style={styles.infoRow}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue} numberOfLines={allowWrap ? 2 : 1}>{value}</Text></View>;
}

function EditableInfoRow({ label, value, onPress, isLast = false }: { label: string; value: string; onPress: () => void; isLast?: boolean }) {
  return <View style={[styles.participantRow, !isLast && styles.participantRowSpaced]}><Text style={styles.infoLabel}>{label}</Text><View style={styles.participantValueColumn}><Text style={styles.infoValue} numberOfLines={1}>{value}</Text></View><Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Editar ${label}`} style={({ pressed }) => [StyleSheet.absoluteFillObject, pressed && styles.rowPressed]} /></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { height: 62, paddingHorizontal: 32, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: colors.ink, fontSize: 18, lineHeight: 22, fontWeight: "700", textAlign: "center", flex: 1 },
  receiptScroll: { flex: 1 },
  receiptBody: { paddingBottom: 35 },
  directionCircle: { alignSelf: "center", width: 82, height: 82, borderRadius: 41, marginTop: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#29292B" },
  amountPressable: { alignSelf: "center", borderRadius: 8, paddingHorizontal: 8, marginTop: 25 },
  amount: { color: colors.ink, fontSize: 31, lineHeight: 37, fontWeight: "700", textAlign: "center" },
  personName: { color: colors.muted, fontSize: 17, lineHeight: 22, textAlign: "center", marginTop: 7, paddingHorizontal: 20 },
  categoryPill: { alignSelf: "center", width: 174, height: 44, borderRadius: 22, marginTop: 30, paddingLeft: 17, paddingRight: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F4F4F6" },
  categoryText: { color: "#242428", fontSize: 16 },
  transactionSection: { marginTop: 56, paddingHorizontal: 45 },
  sectionTitle: { color: colors.ink, fontSize: 21, lineHeight: 26, fontWeight: "700", marginBottom: 25 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 14, marginBottom: 20 },
  infoLabel: { color: colors.muted, fontSize: 15, lineHeight: 20, flexShrink: 0 },
  infoValue: { color: colors.ink, fontSize: 15, lineHeight: 20, fontWeight: "700", textAlign: "right", flex: 1, minWidth: 0 },
  idBlock: { marginTop: 2 },
  idRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  idValue: { color: colors.ink, fontSize: 15, lineHeight: 20, fontWeight: "700", flex: 1 },
  descriptionLink: { marginTop: 24 },
  descriptionText: { color: colors.orange, fontSize: 15, fontWeight: "700" },
  divider: { height: 50, marginTop: 42, backgroundColor: colors.panel },
  participantSection: { paddingHorizontal: 45, paddingTop: 42, paddingBottom: 32 },
  participantRow: { position: "relative", width: "100%", minHeight: 21, flexDirection: "row", alignItems: "center" },
  participantRowSpaced: { marginBottom: 20 },
  participantValueColumn: { flex: 1, minWidth: 0, alignItems: "flex-end", paddingLeft: 18 },
  rowPressed: { opacity: 0.62 },
  pressed: { opacity: 0.6 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30, gap: 14 },
  notFoundTitle: { color: colors.ink, fontSize: 20, fontWeight: "700", textAlign: "center" },
  backFallback: { paddingHorizontal: 20, paddingVertical: 13, borderRadius: 14, backgroundColor: colors.orange },
  backFallbackText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "rgba(0, 0, 0, 0.65)" },
  editorCard: { width: "100%", maxWidth: 390, borderRadius: 20, padding: 20, backgroundColor: "#29292B" },
  editorHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  editorTitle: { flex: 1, color: colors.ink, fontSize: 20, fontWeight: "700" },
  editorInput: { height: 54, marginTop: 18, paddingHorizontal: 15, borderRadius: 13, borderWidth: 1, borderColor: "#454549", backgroundColor: colors.input, color: colors.ink, fontSize: 17 },
  editorActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 18 },
  cancelButton: { minWidth: 100, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#3A3A3D" },
  cancelText: { color: colors.ink, fontSize: 15, fontWeight: "700" },
  saveButton: { minWidth: 100, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.orange },
  saveButtonDisabled: { opacity: 0.5 },
  saveText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});

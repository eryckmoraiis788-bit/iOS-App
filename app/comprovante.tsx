import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNotificationStore } from "@/lib/notification-store";
import { formatReceiptDate, formatReceiptTime } from "@/lib/receipt-utils";

const colors = {
  background: "#1C1C1E",
  ink: "#F5F5F7",
  muted: "#B8B8BC",
  orange: "#EA7900",
  green: "#252527",
  line: "#29292B",
  input: "#2A2A2C",
};

const institutionOptions = [
  "NU PAGAMENTOS - IP",
  "ITAÚ UNIBANCO S.A.",
  "PICPAY",
  "CAIXA ECONOMICA FEDERAL",
  "BANCO INTER",
  "MERCADO PAGO IP LTDA.",
  "BCO DO BRASIL S.A.",
  "PAGSEGURO INTERNET IP S.A.",
] as const;

export default function ReceiptDetailScreen() {
  const router = useRouter();
  const { recordId } = useLocalSearchParams<{ recordId?: string }>();
  const { records, receipts, updateReceipt } = useNotificationStore();
  const record = records.find((item) => item.id === recordId);
  const receipt = receipts.find((item) => item.recordId === recordId);
  const [isSaving, setIsSaving] = useState(false);
  const [institutionPickerOpen, setInstitutionPickerOpen] = useState(false);

  if (!record || !receipt) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#1C1C1E]" safeAreaClassName="bg-[#1C1C1E]" containerStyle={styles.screen}>
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

  const isReceivedPix = record.title.trim().toLowerCase() === "pix recebido";
  const receiptTimestamp = receipt.eventAt;

  const toggleInstitutionPicker = () => setInstitutionPickerOpen((current) => !current);
  const selectInstitution = async (institution: string) => {
    if (isSaving || institution === receipt.institution) {
      setInstitutionPickerOpen(false);
      return;
    }
    setIsSaving(true);
    try {
      await updateReceipt(receipt.id, { institution });
      setInstitutionPickerOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#1C1C1E]" safeAreaClassName="bg-[#1C1C1E]" containerStyle={styles.screen}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Voltar">
            <IconSymbol name="arrow-back" size={26} color={colors.orange} />
          </Pressable>
          <Text style={styles.headerTitle}>{isReceivedPix ? "Pix recebido" : "Pix enviado"}</Text>
          <Pressable hitSlop={12} accessibilityRole="button" accessibilityLabel="Ajuda">
            <MaterialIcons name="help-outline" size={30} color={colors.orange} />
          </Pressable>
        </View>

        <ScrollView style={styles.receiptScroll} contentContainerStyle={styles.receiptBody} showsVerticalScrollIndicator={false}>
          <View style={styles.successCircle}>
            <MaterialIcons name={isReceivedPix ? "arrow-downward" : "arrow-upward"} size={54} color={colors.ink} />
          </View>
          <Text style={styles.amount}>R$ {receipt.amount}</Text>
          <Text style={styles.personName}>{receipt.recipientName}</Text>
          <View style={styles.categoryPill}><Text style={styles.categoryText}>Sem categoria</Text><MaterialIcons name="edit" size={22} color="#55555A" /></View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre a transação</Text>
            <InfoRow label="Data da transação" value={formatReceiptDate(receiptTimestamp)} />
            <InfoRow label="Horário" value={formatReceiptTime(receiptTimestamp)} />
            <View style={styles.idBlock}>
              <Text style={styles.infoLabel}>ID da transação</Text>
              <Text style={styles.idValue} selectable numberOfLines={1}>{receipt.transactionId}</Text>
              <MaterialIcons name="content-copy" size={30} color={colors.orange} style={styles.copyIcon} />
            </View>
            <Text style={styles.descriptionLink}>Adicionar descrição</Text>
          </View>

          <View style={styles.separator} accessibilityElementsHidden />

          <View style={[styles.section, styles.recipientSection]}>
            <Text style={styles.sectionTitle}>{isReceivedPix ? "Quem enviou" : "Quem recebeu"}</Text>
            <RecipientInfoRow label="Nome" value={receipt.recipientName} />
            <RecipientInfoRow label="CPF/CNPJ" value={receipt.document} />
            <InstitutionInfoRow value={receipt.institution} onPress={toggleInstitutionPicker} />
            {institutionPickerOpen && (
              <View style={styles.institutionOptions} accessibilityRole="menu">
                {institutionOptions.map((institution) => (
                  <Pressable
                    key={institution}
                    onPress={() => void selectInstitution(institution)}
                    style={({ pressed }) => [styles.institutionOption, pressed && styles.rowPressed]}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: receipt.institution === institution }}
                    accessibilityLabel={`Selecionar ${institution}`}
                  >
                    <Text style={[styles.institutionOptionText, receipt.institution === institution && styles.institutionOptionSelected]}>{institution}</Text>
                  </Pressable>
                ))}
              </View>
            )}
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
            <View style={styles.newPixButtonFrame}>
              <Text style={styles.newPixText}>Realizar novo Pix</Text>
              <Pressable
                onPress={() => router.replace("/")}
                accessibilityRole="button"
                accessibilityLabel="Realizar novo Pix"
                style={({ pressed }) => [StyleSheet.absoluteFillObject, pressed && styles.buttonPressed]}
              />
            </View>
          </View>
        </ScrollView>
      </View>

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

function RecipientInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.recipientRow}>
      <Text style={[styles.infoLabel, styles.recipientLabel]}>{label}</Text>
      <Text style={styles.recipientValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function InstitutionInfoRow({ value, onPress }: { value: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Escolher instituição"
      style={({ pressed }) => [styles.recipientRow, pressed && styles.rowPressed]}
    >
      <Text style={[styles.infoLabel, styles.recipientLabel]}>Instituição</Text>
      <Text style={styles.institutionValue} numberOfLines={1}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { height: 72, paddingHorizontal: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: colors.ink, fontSize: 20, lineHeight: 24, fontWeight: "600" },
  receiptScroll: { flex: 1 },
  receiptBody: { flexGrow: 1, paddingHorizontal: 30, paddingTop: 18, paddingBottom: 28 },
  successCircle: { alignSelf: "center", width: 116, height: 116, borderRadius: 58, alignItems: "center", justifyContent: "center", backgroundColor: colors.green, marginBottom: 48 },
  amount: { color: colors.ink, fontSize: 42, lineHeight: 48, fontWeight: "700", textAlign: "center" },
  personName: { color: colors.muted, fontSize: 25, lineHeight: 31, fontWeight: "400", textAlign: "center", marginTop: 12 },
  categoryPill: { alignSelf: "center", minWidth: 250, height: 58, marginTop: 52, paddingLeft: 26, paddingRight: 8, borderRadius: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F4F4F6" },
  categoryText: { color: "#242426", fontSize: 20, fontWeight: "400" },
  section: { marginTop: 78 },
  sectionTitle: { color: colors.ink, fontSize: 27, lineHeight: 33, fontWeight: "700", marginBottom: 34 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 27 },
  rowPressed: { opacity: 0.62 },
  infoLabel: { color: colors.muted, fontSize: 20, lineHeight: 25, flexShrink: 0 },
  infoValue: { color: colors.ink, fontSize: 20, lineHeight: 25, fontWeight: "600", textAlign: "right", flex: 1, minWidth: 0 },
  recipientLabel: { width: 100 },
  recipientValue: { position: "absolute", left: 100, right: 0, color: colors.ink, fontSize: 16, lineHeight: 21, fontWeight: "600", textAlign: "right" },
  institutionValue: { position: "absolute", left: 100, right: 0, color: colors.ink, fontSize: 13, lineHeight: 18, fontWeight: "600", textAlign: "right" },
  idBlock: { marginTop: 7, position: "relative" },
  idValue: { color: colors.ink, fontSize: 20, lineHeight: 25, fontWeight: "600", marginTop: 10, paddingRight: 42 },
  copyIcon: { position: "absolute", right: 0, bottom: 0 },
  descriptionLink: { color: colors.orange, fontSize: 20, lineHeight: 25, fontWeight: "600", marginTop: 32 },
  separator: { height: 14, marginTop: 78, marginHorizontal: -30, backgroundColor: "#252527" },
  recipientSection: { marginTop: 72 },
  actions: { width: "100%", alignItems: "stretch", marginTop: 32, paddingBottom: 12 },
  shareButton: { width: "100%", height: 54, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: colors.orange, opacity: 1 },
  shareText: { color: "#FFFFFF", fontSize: 17, fontWeight: "600" },
  recipientRow: { position: "relative", width: "100%", minHeight: 30, height: 30, flexDirection: "row", alignItems: "center", marginBottom: 22 },
  institutionOptions: { marginTop: 10, marginLeft: 100, borderRadius: 12, borderWidth: 1, borderColor: "#48484A", backgroundColor: "#29292B", overflow: "hidden" },
  institutionOption: { minHeight: 42, justifyContent: "center", paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: "#48484A" },
  institutionOptionText: { color: colors.ink, fontSize: 15, lineHeight: 19 },
  institutionOptionSelected: { color: colors.orange, fontWeight: "700" },
  newPixButtonFrame: { position: "relative", width: "100%", minHeight: 54, height: 54, marginTop: 13, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: "transparent", borderWidth: 1.5, borderColor: "#8A4B09", overflow: "hidden" },
  newPixText: { color: colors.orange, fontSize: 17, lineHeight: 21, fontWeight: "600", textAlign: "center" },
  buttonPressed: { opacity: 0.08 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30, gap: 14 },
  notFoundTitle: { color: colors.ink, fontSize: 20, fontWeight: "700", textAlign: "center" },
  backFallback: { paddingHorizontal: 20, paddingVertical: 13, borderRadius: 14, backgroundColor: colors.orange },
  backFallbackText: { color: colors.background, fontSize: 15, fontWeight: "700" },
});

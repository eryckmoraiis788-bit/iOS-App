import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNotificationStore } from "@/lib/notification-store";
import { formatReceiptDate, formatReceiptTime } from "@/lib/receipt-utils";

const colors = {
  background: "#FFFFFF",
  ink: "#161616",
  muted: "#777777",
  orange: "#EA7900",
  green: "#00AA5B",
  line: "#E8E8E8",
  input: "#F8F8F8",
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
          <Text style={styles.successTitle}>{record.title || (isReceivedPix ? "Pix recebido" : "Pix enviado")}</Text>
          <Text style={styles.amount}>R$ {receipt.amount}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre a transação</Text>
            <InfoRow label="Data do pagamento" value={formatReceiptDate(receiptTimestamp)} />
            <InfoRow label="Horário" value={formatReceiptTime(receiptTimestamp)} />
            <View style={styles.idBlock}>
              <Text style={styles.infoLabel}>ID da transação</Text>
              <Text style={styles.idValue} selectable numberOfLines={1}>{receipt.transactionId}</Text>
            </View>
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
      <View style={styles.recipientValueColumn}>
        <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
      </View>
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
      <View style={styles.recipientValueColumn}>
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
  amount: { color: colors.ink, fontSize: 25, lineHeight: 30, fontWeight: "600", textAlign: "center" },
  section: { marginTop: 54 },
  sectionTitle: { color: colors.ink, fontSize: 20, lineHeight: 24, fontWeight: "600", marginBottom: 16 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 12 },
  rowPressed: { opacity: 0.62 },
  infoLabel: { color: colors.muted, fontSize: 16, lineHeight: 21, flexShrink: 0 },
  infoValue: { color: colors.ink, fontSize: 16, lineHeight: 21, fontWeight: "600", textAlign: "right", flex: 1, minWidth: 0 },
  recipientLabel: { width: 92 },
  recipientValueColumn: { flex: 1, minWidth: 0, alignItems: "flex-end" },
  idBlock: { marginTop: 1 },
  idValue: { color: colors.ink, fontSize: 16, lineHeight: 21, fontWeight: "600", marginTop: 6 },
  separator: { height: 1, marginTop: 32, borderTopWidth: 1, borderTopColor: "#E4E4E4", borderStyle: "dashed", opacity: 0.72 },
  recipientSection: { marginTop: 42 },
  actions: { width: "100%", alignItems: "stretch", marginTop: 24, paddingBottom: 12 },
  shareButton: { width: "100%", height: 48, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: "#EA7900", opacity: 1 },
  shareText: { color: colors.background, fontSize: 17, fontWeight: "600" },
  recipientRow: { width: "100%", minHeight: 21, height: 21, flexDirection: "row", alignItems: "center", marginBottom: 8 },
  institutionOptions: { marginTop: 10, marginLeft: 92, borderRadius: 12, borderWidth: 1, borderColor: "#E8E8E8", backgroundColor: "#FAFAFA", overflow: "hidden" },
  institutionOption: { minHeight: 38, justifyContent: "center", paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: "#EEEEEE" },
  institutionOptionText: { color: colors.ink, fontSize: 13, lineHeight: 17 },
  institutionOptionSelected: { color: colors.orange, fontWeight: "700" },
  newPixButtonFrame: { position: "relative", width: "100%", minHeight: 48, height: 48, marginTop: 13, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: "#F2B16E", overflow: "hidden" },
  newPixText: { color: colors.orange, fontSize: 17, lineHeight: 21, fontWeight: "600", textAlign: "center" },
  buttonPressed: { opacity: 0.08 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30, gap: 14 },
  notFoundTitle: { color: colors.ink, fontSize: 20, fontWeight: "700", textAlign: "center" },
  backFallback: { paddingHorizontal: 20, paddingVertical: 13, borderRadius: 14, backgroundColor: colors.orange },
  backFallbackText: { color: colors.background, fontSize: 15, fontWeight: "700" },
});

import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNotificationStore } from "@/lib/notification-store";
import { formatReceiptPersonName, formatReceiptTime } from "@/lib/receipt-utils";

const colors = {
  background: "#FFFFFF",
  ink: "#191919",
  muted: "#737373",
  orange: "#F56800",
  success: "#00A651",
  line: "#ECECEC",
  menu: "#FFFFFF",
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

const payer = {
  name: "ERYCK DARLISSON DOS SANTOS MORAIS",
  document: "***.484.813-**",
  institution: "BANCO INTER",
};

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
          <MaterialIcons name="receipt-long" size={42} color={colors.orange} />
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
  const recipientName = formatReceiptPersonName(receipt.recipientName);
  const payerName = record.senderName?.trim() || payer.name;
  const payerDocument = record.senderDocument?.trim() || payer.document;

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
  const randomInstitution = async () => {
    if (isSaving) return;
    const available = institutionOptions.filter((institution) => institution !== receipt.institution);
    const nextInstitution = available[Math.floor(Math.random() * available.length)] ?? institutionOptions[0];
    await selectInstitution(nextInstitution);
  };
  const handleShare = async () => {
    const kind = isReceivedPix ? "Pix recebido" : "Pix enviado";
    const message = [
      `Comprovante de ${kind}`,
      `Valor: R$ ${receipt.amount}`,
      `ID da transação: ${receipt.transactionId}`,
      `Destinatário: ${recipientName}`,
    ].join("\n");

    try {
      await Share.share({ message, title: "Comprovante Pix" });
    } catch (error) {
      console.error("[receipt] failed to share receipt", error);
    }
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-white" safeAreaClassName="bg-white" containerStyle={styles.screen}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Voltar">
            <MaterialIcons name="arrow-back" size={25} color={colors.orange} />
          </Pressable>
          <Text style={styles.headerTitle}>Comprovante</Text>
          <Pressable onPress={() => router.replace("/")} hitSlop={12} accessibilityRole="button" accessibilityLabel="Início">
            <IconSymbol name="house.fill" size={26} color={colors.orange} weight="regular" />
          </Pressable>
        </View>

        <ScrollView style={styles.receiptScroll} contentContainerStyle={styles.receiptBody} showsVerticalScrollIndicator={true}>
          <View style={styles.successCircle}>
            <MaterialIcons name="check" size={37} color="#FFFFFF" />
          </View>
          <Text style={styles.receiptTitle}>Pix {isReceivedPix ? "recebido" : "enviado"}</Text>
          <Text style={styles.amount}>R$ {receipt.amount}</Text>

          <View style={[styles.section, styles.firstSection]}>
            <Text style={styles.sectionTitle}>Sobre a transação</Text>
            <InfoRow label="Data do pagamento" value={formatReceiptDateReference(receiptTimestamp)} />
            <InfoRow label="Horário" value={formatReceiptTime(receiptTimestamp)} />
            <LongInfo label="ID da transação" value={receipt.transactionId} />
          </View>

          <View style={styles.separator} accessibilityElementsHidden />

          <View style={[styles.section, styles.recipientSection]}>
            <Text style={styles.sectionTitle}>{isReceivedPix ? "Quem enviou" : "Quem recebeu"}</Text>
            <InfoRow label="Nome" value={recipientName} />
            <InfoRow label="CPF/CNPJ" value={receipt.document} />
            <InstitutionInfoRow value={receipt.institution} onPress={() => void randomInstitution()} onLongPress={toggleInstitutionPicker} />
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
            <LongInfo label="Chave Pix" value={receipt.pixKey} variant="pixKey" />
          </View>
          {!isReceivedPix && (
            <>
              <View style={styles.separator} accessibilityElementsHidden />
              <View style={[styles.section, styles.payerSection]}>
                <Text style={styles.sectionTitle}>Quem pagou</Text>
                <InfoRow label="Nome" value={payerName} />
                <InfoRow label="CPF/CNPJ" value={payerDocument} />
                <InfoRow label="Instituição" value={payer.institution} />
              </View>
            </>
          )}
        </ScrollView>
        <View style={styles.footer} accessibilityRole="toolbar">
          <Pressable
            onPress={() => void handleShare()}
            accessibilityRole="button"
            accessibilityLabel="Compartilhar comprovante"
            style={({ pressed }) => [styles.shareButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.shareText}>Compartilhar comprovante</Text>
          </Pressable>
          <View style={styles.newPixButtonFrame}>
            <Text style={styles.newPixText}>Realizar novo Pix</Text>
            <Pressable
              onPress={() => router.replace("/")}
              accessibilityRole="button"
              accessibilityLabel="Realizar novo Pix"
              style={({ pressed }) => [StyleSheet.absoluteFillObject, pressed && styles.newPixPressed]}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>{value}</Text>
    </View>
  );
}

function formatReceiptDateReference(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data indisponível";
  const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${weekdays[date.getDay()]}, ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function LongInfo({ label, value, variant }: { label: string; value: string; variant?: "pixKey" }) {
  return (
    <View style={[styles.longInfo, variant === "pixKey" && styles.pixKeyInfo]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.longValue} selectable>{value}</Text>
    </View>
  );
}

function InstitutionInfoRow({ value, onPress, onLongPress }: { value: string; onPress: () => void; onLongPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={450}
      accessibilityRole="button"
      accessibilityLabel="Trocar instituição aleatoriamente; mantenha pressionado para escolher"
      style={({ pressed }) => [styles.institutionRow, pressed && styles.rowPressed]}
    >
      <Text style={styles.infoLabel}>Instituição</Text>
      <Text style={styles.institutionValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { height: 48, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.background },
  headerTitle: { color: colors.ink, fontSize: 17, lineHeight: 22, fontWeight: "600" },
  receiptScroll: { flex: 1 },
  receiptBody: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  successCircle: { alignSelf: "center", width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", backgroundColor: colors.success, marginBottom: 16 },
  receiptTitle: { color: colors.ink, fontSize: 23, lineHeight: 28, fontWeight: "700", textAlign: "center" },
  amount: { color: colors.ink, fontSize: 23, lineHeight: 28, fontWeight: "700", textAlign: "center", marginTop: 0 },
  section: { marginTop: 56 },
  firstSection: { marginTop: 56 },
  sectionTitle: { color: colors.ink, fontSize: 16, lineHeight: 20, fontWeight: "700", marginBottom: 18 },
  infoRow: { minHeight: 30, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 7 },
  institutionRow: { minHeight: 30, position: "relative", marginBottom: 7 },
  infoLabel: { color: colors.muted, fontSize: 14, lineHeight: 20, fontWeight: "400", flexShrink: 0 },
  infoValue: { color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: "700", textAlign: "right", flex: 1, minWidth: 0 },
  institutionValue: { position: "absolute", left: 105, right: 0, top: 0, color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: "700", textAlign: "right" },
  longInfo: { marginBottom: 9 },
  pixKeyInfo: { marginTop: 10 },
  longValue: { color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: "700", marginTop: 1 },
  separator: { height: 1, borderBottomWidth: 1, borderColor: colors.line, borderStyle: "dashed", marginTop: 28 },
  recipientSection: { marginTop: 39 },
  payerSection: { marginTop: 39 },
  institutionOptions: { marginTop: 4, marginBottom: 8, borderRadius: 8, borderWidth: 1, borderColor: "#E0E0E0", backgroundColor: colors.menu, overflow: "hidden" },
  institutionOption: { minHeight: 40, justifyContent: "center", paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  institutionOptionText: { color: colors.ink, fontSize: 14, lineHeight: 18 },
  institutionOptionSelected: { color: colors.orange, fontWeight: "700" },
  rowPressed: { opacity: 0.62 },
  footer: { height: 144, flexGrow: 0, flexShrink: 0, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 12, backgroundColor: "#FFFFFF" },
  shareButton: { alignSelf: "stretch", width: "100%", height: 52, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: "#F56800", marginBottom: 12 },
  shareText: { color: "#FFFFFF", fontSize: 16, lineHeight: 22, fontWeight: "700", textAlign: "center" },
  newPixButtonFrame: { position: "relative", alignSelf: "stretch", width: "100%", height: 52, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: "#F2B16E", overflow: "hidden" },
  newPixText: { color: "#F56800", fontSize: 16, lineHeight: 22, fontWeight: "700", textAlign: "center" },
  newPixPressed: { backgroundColor: "rgba(245, 104, 0, 0.08)" },
  buttonPressed: { opacity: 0.78 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30, gap: 14 },
  notFoundTitle: { color: colors.ink, fontSize: 20, fontWeight: "700", textAlign: "center" },
  backFallback: { paddingHorizontal: 20, paddingVertical: 13, borderRadius: 14, backgroundColor: colors.orange },
  backFallbackText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});

import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNotificationStore } from "@/lib/notification-store";
import { extractReceiptAmount, formatReceiptDate, formatReceiptTime } from "@/lib/receipt-utils";

const colors = {
  background: "#FFFFFF",
  ink: "#161616",
  muted: "#777777",
  orange: "#EA7900",
  green: "#00AA5B",
  line: "#E8E8E8",
  disabled: "#B8B8B8",
};

export default function ReceiptDetailScreen() {
  const router = useRouter();
  const { recordId } = useLocalSearchParams<{ recordId?: string }>();
  const { records } = useNotificationStore();
  const record = records.find((item) => item.id === recordId);

  if (!record) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-white">
        <View style={styles.notFound}>
          <IconSymbol name="receipt" size={42} color={colors.orange} />
          <Text style={styles.notFoundTitle}>Comprovante não encontrado</Text>
          <Pressable onPress={() => router.replace("/")} style={styles.backFallback} accessibilityRole="button">
            <Text style={styles.backFallbackText}>Voltar para Compor</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const transactionId = record.notificationId || record.id;
  const amount = extractReceiptAmount(record);

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-white">
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Voltar">
            <IconSymbol name="arrow-back" size={33} color={colors.orange} />
          </Pressable>
          <Text style={styles.headerTitle}>Comprovante</Text>
          <Pressable onPress={() => router.replace("/")} hitSlop={12} accessibilityRole="button" accessibilityLabel="Ir para o início">
            <IconSymbol name="house.fill" size={32} color={colors.orange} />
          </Pressable>
        </View>

        <View style={styles.receiptBody}>
          <View style={styles.successCircle}>
            <IconSymbol name="check" size={58} color={colors.background} />
          </View>
          <Text style={styles.successTitle}>Pix enviado</Text>
          <Text style={styles.amount}>R$ {amount}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre a transação</Text>
            <InfoRow label="Data do pagamento" value={formatReceiptDate(record.createdAt)} />
            <InfoRow label="Horário" value={formatReceiptTime(record.createdAt)} />
            <View style={styles.idBlock}>
              <Text style={styles.infoLabel}>ID da transação</Text>
              <Text style={styles.idValue} selectable>{transactionId}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={[styles.section, styles.recipientSection]}>
            <Text style={styles.sectionTitle}>Quem recebeu</Text>
            <InfoRow label="Nome" value="Eryck Darlisson dos Santos Morais" />
            <InfoRow label="CPF/CNPJ" value="***.484.813-**" />
            <InfoRow label="Instituição" value="Cloudwalk Ip LTDA" />
          </View>

          <View style={styles.actions}>
            <Pressable
              disabled
              accessibilityRole="button"
              accessibilityLabel="Compartilhar comprovante indisponível"
              accessibilityState={{ disabled: true }}
              style={styles.shareButton}
            >
              <Text style={styles.shareText}>Compartilhar comprovante</Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace("/")}
              accessibilityRole="button"
              accessibilityLabel="Realizar novo Pix"
              style={({ pressed }) => [styles.newPixButton, pressed && { opacity: 0.72 }]}
            >
              <Text style={styles.newPixText}>Realizar novo Pix</Text>
            </Pressable>
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
      <Text style={styles.infoValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { height: 68, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: colors.ink, fontSize: 25, fontWeight: "800" },
  receiptBody: { flex: 1, paddingHorizontal: 45, paddingTop: 56 },
  successCircle: { alignSelf: "center", width: 118, height: 118, borderRadius: 59, alignItems: "center", justifyContent: "center", backgroundColor: colors.green },
  successTitle: { color: colors.ink, fontSize: 43, lineHeight: 51, fontWeight: "800", textAlign: "center", marginTop: 35 },
  amount: { color: colors.ink, fontSize: 43, lineHeight: 51, fontWeight: "800", textAlign: "center" },
  section: { marginTop: 88 },
  sectionTitle: { color: colors.ink, fontSize: 23, lineHeight: 28, fontWeight: "800", marginBottom: 27 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 20, marginBottom: 22 },
  infoLabel: { color: colors.muted, fontSize: 17, lineHeight: 22, flexShrink: 0 },
  infoValue: { color: colors.ink, fontSize: 17, lineHeight: 22, fontWeight: "800", textAlign: "right", flex: 1 },
  idBlock: { marginTop: 1 },
  idValue: { color: colors.ink, fontSize: 17, lineHeight: 23, fontWeight: "800", marginTop: 8 },
  separator: { borderTopWidth: 1, borderTopColor: colors.line, borderStyle: "dashed", marginTop: 54 },
  recipientSection: { marginTop: 74 },
  actions: { marginTop: "auto", paddingTop: 42, paddingBottom: 18 },
  shareButton: { height: 68, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#F4A15C", opacity: 0.66 },
  shareText: { color: colors.background, fontSize: 18, fontWeight: "800" },
  newPixButton: { height: 68, marginTop: 17, borderRadius: 15, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#F2B16E" },
  newPixText: { color: colors.orange, fontSize: 18, fontWeight: "800" },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30, gap: 14 },
  notFoundTitle: { color: colors.ink, fontSize: 20, fontWeight: "800", textAlign: "center" },
  backFallback: { paddingHorizontal: 20, paddingVertical: 13, borderRadius: 14, backgroundColor: colors.orange },
  backFallbackText: { color: colors.background, fontSize: 15, fontWeight: "800" },
});

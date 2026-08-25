import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNotificationStore, type NotificationRecord } from "@/lib/notification-store";
import { extractReceiptAmount, formatReceiptDate, formatReceiptTime } from "@/lib/receipt-utils";

const colors = {
  background: "#FFFFFF",
  ink: "#121B24",
  muted: "#667580",
  orange: "#EA702D",
  orangeSoft: "#FFF3E9",
  green: "#00A859",
  border: "#E6E8EA",
};

export default function ReceiptsScreen() {
  const router = useRouter();
  const { records, refreshScheduled } = useNotificationStore();

  useFocusEffect(useCallback(() => {
    void refreshScheduled();
  }, [refreshScheduled]));

  const receipts = useMemo(
    () => records
      .filter((record) => record.status === "sent" || record.status === "delivered")
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()),
    [records],
  );

  return (
    <ScreenContainer edges={["top", "left", "right"]} containerClassName="bg-white">
      <FlatList
        data={receipts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, receipts.length === 0 && styles.emptyContent]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ReceiptsHeader count={receipts.length} />}
        ListEmptyComponent={(
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}><IconSymbol name="receipt" size={32} color={colors.orange} /></View>
            <Text style={styles.emptyTitle}>Nenhum comprovante ainda</Text>
            <Text style={styles.emptyBody}>Os comprovantes das notificações emitidas aparecerão aqui automaticamente.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <ReceiptCard
            item={item}
            onPress={() => router.push({ pathname: "/comprovante", params: { recordId: item.id } })}
          />
        )}
      />
    </ScreenContainer>
  );
}

function ReceiptsHeader({ count }: { count: number }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Image source={require("@/assets/images/icon.png")} style={styles.headerLogo} />
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>REGISTROS DO APP</Text>
          <Text style={styles.heading}>Comprovantes</Text>
        </View>
        <View style={styles.countBadge}><Text style={styles.countText}>{count}</Text></View>
      </View>
      <Text style={styles.subtitle}>Veja os comprovantes das notificações emitidas.</Text>
    </View>
  );
}

function ReceiptCard({ item, onPress }: { item: NotificationRecord; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Abrir comprovante de ${item.title}`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.successIcon}><IconSymbol name="check-circle" size={27} color={colors.green} /></View>
      <View style={styles.cardCopy}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title || "Pix enviado"}</Text>
          <Text style={styles.amount}>R$ {extractReceiptAmount(item)}</Text>
        </View>
        <Text style={styles.cardMeta}>{formatReceiptDate(item.createdAt)} • {formatReceiptTime(item.createdAt)}</Text>
        <Text style={styles.cardBody} numberOfLines={2}>{item.body}</Text>
        <View style={styles.openRow}>
          <Text style={styles.openText}>Ver comprovante</Text>
          <IconSymbol name="chevron.right" size={19} color={colors.orange} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 42, gap: 14 },
  emptyContent: { flexGrow: 1 },
  header: { gap: 5, marginTop: 4, marginBottom: 4 },
  headerTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerLogo: { width: 51, height: 51, borderRadius: 16 },
  headerCopy: { flex: 1 },
  eyebrow: { color: colors.orange, fontSize: 10, fontWeight: "800", letterSpacing: 2.2 },
  heading: { color: colors.ink, fontSize: 31, lineHeight: 37, fontWeight: "900" },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 22 },
  countBadge: { minWidth: 38, height: 38, paddingHorizontal: 8, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: colors.orangeSoft },
  countText: { color: colors.orange, fontSize: 16, fontWeight: "900" },
  card: { flexDirection: "row", gap: 13, padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: 21, backgroundColor: colors.background },
  cardPressed: { opacity: 0.72 },
  successIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "#E8F8EF" },
  cardCopy: { flex: 1, minWidth: 0 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  cardTitle: { flex: 1, color: colors.ink, fontSize: 16, fontWeight: "900" },
  amount: { color: colors.ink, fontSize: 15, fontWeight: "900" },
  cardMeta: { color: colors.muted, fontSize: 12, marginTop: 4 },
  cardBody: { color: colors.ink, fontSize: 14, lineHeight: 19, marginTop: 7 },
  openRow: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 3, marginTop: 9 },
  openText: { color: colors.orange, fontSize: 13, fontWeight: "900" },
  emptyCard: { flex: 1, minHeight: 250, alignItems: "center", justifyContent: "center", padding: 30, borderWidth: 1, borderColor: colors.border, borderRadius: 24, backgroundColor: "#FCFCFC" },
  emptyIcon: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: colors.orangeSoft, marginBottom: 13 },
  emptyTitle: { color: colors.ink, fontSize: 19, fontWeight: "900", textAlign: "center" },
  emptyBody: { color: colors.muted, fontSize: 15, lineHeight: 21, textAlign: "center", marginTop: 5 },
});

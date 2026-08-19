import { Alert, ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { AnimatedScreen } from "@/components/animated-screen";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNotificationStore, type NotificationRecord } from "@/lib/notification-store";

const ink = "#121B24";
const muted = "#667580";
const teal = "#0E8278";
const border = "#D4E0E5";

export default function HistoryScreen() {
  const router = useRouter();
  const { records, remove, clearHistory } = useNotificationStore();
  const history = records.filter((item) => item.status !== "pending");

  const clearAll = () => {
    if (history.length === 0) return;
    Alert.alert(
      "Limpar histórico?",
      "Todas as notificações do histórico serão removidas. Os agendamentos pendentes não serão cancelados.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Limpar tudo", style: "destructive", onPress: () => void clearHistory() },
      ],
    );
  };


  const scheduleAgain = (item: NotificationRecord) => {
    router.push({ pathname: "/schedule", params: { historyTitle: item.title, historySubtitle: item.subtitle, historyBody: item.body, historyImageUri: item.imageUri ?? "" } });
  };

  return (
    <ScreenContainer containerClassName="bg-[#EAF4F8]">
      <AnimatedScreen>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<HistoryHeader count={history.length} onClear={clearAll} />}
        ListEmptyComponent={<View style={styles.empty}><IconSymbol name="clock.arrow.circlepath" size={35} color={muted} /><Text style={styles.emptyTitle}>Nenhuma notificação ainda</Text><Text style={styles.emptyBody}>As notificações emitidas aparecerão aqui.</Text></View>}
        renderItem={({ item }) => <HistoryCard item={item} onScheduleAgain={() => scheduleAgain(item)} onRemove={() => Alert.alert("Excluir notificação?", "Este registro será removido do histórico.", [{ text: "Cancelar", style: "cancel" }, { text: "Excluir", style: "destructive", onPress: () => void remove(item) }])} />}
      />
      </AnimatedScreen>
    </ScreenContainer>
  );
}

function HistoryHeader({ count, onClear }: { count: number; onClear: () => void }) {
  return <View style={styles.header}><Text style={styles.eyebrow}>REGISTROS DO APP</Text><View style={styles.titleRow}><Text style={styles.heading}>Histórico</Text>{count > 0 ? <Pressable onPress={onClear} style={({ pressed }) => [styles.clearButton, pressed && { opacity: 0.7 }]}><IconSymbol name="trash" size={17} color="#B44B47" /><Text style={styles.clearText}>Limpar tudo</Text></Pressable> : null}</View><Text style={styles.subtitle}>Veja as notificações que você emitiu.</Text></View>;
}

function HistoryCard({ item, onScheduleAgain, onRemove }: { item: NotificationRecord; onScheduleAgain: () => void; onRemove: () => void }) {
  const { emit } = useNotificationStore();
  const [repeating, setRepeating] = useState(false);

  const handleRepeat = async () => {
    if (repeating) return;
    setRepeating(true);
    try {
      const sent = await emit({ title: item.title, subtitle: item.subtitle, body: item.body, imageUri: item.imageUri });
      if (sent) Alert.alert("Notificação emitida", "A mesma mensagem foi emitida novamente.");
    } catch (error) {
      Alert.alert("Não foi possível repetir", error instanceof Error ? error.message : "Tente novamente.");
    }
    finally { setRepeating(false); }
  };

  return <View style={styles.card}><View style={styles.icon}><Image source={require("@/assets/images/icon.png")} style={styles.brandImage} /></View><View style={styles.copy}><View style={styles.row}><Text style={styles.title}>{item.title}</Text><Text style={styles.type}>{item.kind === "immediate" ? "agora" : item.status === "cancelled" ? "cancelada" : "entregue"}</Text></View>{item.subtitle ? <Text style={styles.subtitleCard}>{item.subtitle}</Text> : null}<Text style={styles.body}>{item.body}</Text><View style={styles.footer}><Text style={styles.date}>{new Date(item.createdAt).toLocaleString("pt-BR")}</Text><Pressable onPress={onRemove} hitSlop={8} style={({ pressed }) => [styles.removeButton, pressed && { opacity: 0.65 }]} accessibilityLabel="Excluir notificação"><IconSymbol name="trash" size={17} color="#B44B47" /><Text style={styles.removeText}>Excluir</Text></Pressable></View><View style={styles.quickActions}><Pressable onPress={handleRepeat} disabled={repeating} style={({ pressed }) => [styles.quickButton, pressed && { opacity: 0.7 }]} accessibilityRole="button" accessibilityLabel="Repetir notificação">{repeating ? <ActivityIndicator size="small" color={teal} /> : <IconSymbol name="refresh" size={17} color={teal} />}<Text style={styles.quickText}>{repeating ? "Emitindo..." : "Repetir"}</Text></Pressable><Pressable onPress={onScheduleAgain} style={({ pressed }) => [styles.quickButton, pressed && { opacity: 0.7 }]} accessibilityRole="button" accessibilityLabel="Agendar novamente"><IconSymbol name="calendar.badge.clock" size={17} color={teal} /><Text style={styles.quickText}>Agendar novamente</Text></Pressable></View></View></View>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40, gap: 15 },
  header: { gap: 3, marginTop: 10, marginBottom: 3 },
  eyebrow: { color: teal, fontSize: 12, fontWeight: "800", letterSpacing: 3 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  heading: { color: ink, fontSize: 34, fontWeight: "900" },
  subtitle: { color: muted, fontSize: 17, lineHeight: 24 },
  clearButton: { borderWidth: 1, borderColor: "#E8B7B4", borderRadius: 12, paddingVertical: 9, paddingHorizontal: 11, flexDirection: "row", alignItems: "center", gap: 6 },
  clearText: { color: "#B44B47", fontSize: 13, fontWeight: "800" },
  card: { backgroundColor: "#FFF", borderRadius: 24, borderWidth: 1, borderColor: border, padding: 17, flexDirection: "row", gap: 13 },
  icon: { width: 48, height: 48, borderRadius: 15, backgroundColor: teal, alignItems: "center", justifyContent: "center" },
  brandImage: { width: "100%", height: "100%", borderRadius: 15 },
  copy: { flex: 1 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 5 },
  title: { color: ink, fontSize: 17, fontWeight: "800", flex: 1 },
  type: { color: teal, fontSize: 12, fontWeight: "800" },
  subtitleCard: { color: muted, fontSize: 15, marginTop: 4 },
  body: { color: ink, fontSize: 15, marginTop: 3 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 9 },
  date: { color: muted, fontSize: 12, flex: 1 },
  removeButton: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 3 },
  removeText: { color: "#B44B47", fontSize: 12, fontWeight: "800" },
  quickActions: { flexDirection: "row", gap: 8, marginTop: 13, flexWrap: "wrap" },
  quickButton: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderColor: "#B5DCD8", backgroundColor: "#F0FAF8", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  quickText: { color: teal, fontSize: 12, fontWeight: "800" },
  empty: { backgroundColor: "#FFF", borderRadius: 24, borderWidth: 1, borderColor: border, alignItems: "center", padding: 30, gap: 8, marginTop: 12 },
  emptyTitle: { color: ink, fontWeight: "900", fontSize: 18 },
  emptyBody: { color: muted, fontSize: 15, textAlign: "center" },
});

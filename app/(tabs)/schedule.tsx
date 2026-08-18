import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNotificationStore } from "@/lib/notification-store";

const teal = "#0E8278"; const bg = "#EAF4F8"; const ink = "#121B24"; const muted = "#667580"; const border = "#D4E0E5";
export default function ScheduleScreen() {
  const { schedule, records, selectedImage, refreshScheduled, clearScheduled } = useNotificationStore();
  const [title, setTitle] = useState(""); const [subtitle, setSubtitle] = useState(""); const [body, setBody] = useState(""); const [minutes, setMinutes] = useState(1);
  const pending = records.filter((item) => item.status === "pending");
  useEffect(() => { void refreshScheduled(); }, [refreshScheduled]);
  const applyPixPreset = (kind: "received" | "sent") => {
    if (kind === "received") {
      setTitle("Pix recebido");
      setBody("[Nome de quem enviou] te enviou um Pix de R$ [valor] creditado na sua conta final ***15448-3.");
      return;
    }
    setTitle("Pix enviado");
    setBody("Você fez um Pix no valor de R$ [valor] para [Nome de quem recebeu].");
  };
  const submit = async () => { if (!body.trim()) { Alert.alert("Preencha a notificação", "Informe a mensagem para agendar."); return; } await schedule({ title: title.trim() || "Notificação", subtitle: subtitle.trim(), body: body.trim(), imageUri: selectedImage }, minutes); Alert.alert("Notificação agendada", `Ela será emitida em ${minutes} minuto${minutes === 1 ? "" : "s"}.`); setTitle(""); setSubtitle(""); setBody(""); };
  return <ScreenContainer containerClassName="bg-[#EAF4F8]"><ScrollView contentContainerStyle={styles.content}><Text style={styles.heading}>Agendar Notificação</Text><Text style={styles.modelLabel}>Usar modelo Pix</Text><View style={styles.modelRow}><Pressable onPress={() => applyPixPreset("received")} style={styles.modelButton}><Text style={styles.modelButtonText}>Pix recebido</Text></Pressable><Pressable onPress={() => applyPixPreset("sent")} style={styles.modelButton}><Text style={styles.modelButtonText}>Pix enviado</Text></Pressable></View><Field label="Nome do Banco (Título)" value={title} onChangeText={setTitle} placeholder="Ex: Inter" /><Field label="Subtítulo (Opcional)" value={subtitle} onChangeText={setSubtitle} placeholder="Ex: Transação confirmada" /><Field label="Mensagem (Corpo)" value={body} onChangeText={setBody} placeholder="Ex: Você recebeu um Pix de R$ 100,00" multiline /><Text style={styles.label}>Quando enviar?</Text><View style={styles.grid}>{[1, 5, 10, 30].map((value) => <Pressable key={value} onPress={() => setMinutes(value)} style={[styles.choice, minutes === value && styles.choiceActive]}><Text style={[styles.choiceText, minutes === value && { color: "#FFF" }]}>{value} minuto{value === 1 ? "" : "s"}</Text></Pressable>)}</View><Pressable onPress={submit} style={styles.button}><IconSymbol name="calendar.badge.clock" size={24} color="#FFF" /><Text style={styles.buttonText}>Agendar Agora</Text></Pressable><View style={styles.sectionHeader}><Text style={styles.section}>Agendamentos pendentes</Text><Pressable onPress={() => void refreshScheduled()} style={styles.refreshButton}><IconSymbol name="clock.arrow.circlepath" size={17} color={teal} /><Text style={styles.refreshText}>Atualizar</Text></Pressable></View>{pending.length > 0 && <Pressable onPress={() => Alert.alert("Cancelar agendamentos", "Deseja cancelar todos os agendamentos pendentes?", [{ text: "Não", style: "cancel" }, { text: "Cancelar todos", style: "destructive", onPress: () => void clearScheduled() }])} style={styles.clearButton}><IconSymbol name="trash" size={18} color="#B44B47" /><Text style={styles.clearText}>Cancelar todos os agendamentos</Text></Pressable>}{pending.length === 0 ? <View style={styles.empty}><IconSymbol name="calendar.badge.clock" size={30} color={muted} /><Text style={styles.emptyText}>Nenhum agendamento pendente.</Text></View> : pending.map((item) => <PendingCard key={item.id} item={item} />)}</ScrollView></ScreenContainer>;
}
function Field({ label, value, onChangeText, placeholder, multiline = false }: { label: string; value: string; onChangeText: (v: string) => void; placeholder: string; multiline?: boolean }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#B7C0C5" multiline={multiline} textAlignVertical={multiline ? "top" : "center"} style={[styles.input, multiline && { minHeight: 110, paddingTop: 15 }]} /></View>; }
function PendingCard({ item }: { item: import("@/lib/notification-store").NotificationRecord }) {
  const { cancel, remove, updateScheduled } = useNotificationStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editSubtitle, setEditSubtitle] = useState(item.subtitle);
  const [editBody, setEditBody] = useState(item.body);

  const openEditor = () => {
    setEditTitle(item.title);
    setEditSubtitle(item.subtitle);
    setEditBody(item.body);
    setEditing(true);
  };

  const saveEdit = async () => {
    const nextBody = editBody.trim();
    if (!nextBody) {
      Alert.alert("Mensagem obrigatória", "Informe a mensagem da notificação.");
      return;
    }
    setSaving(true);
    try {
      await updateScheduled(item, {
        title: editTitle.trim() || "Notificação",
        subtitle: editSubtitle.trim(),
        body: nextBody,
        imageUri: item.imageUri,
      });
      setEditing(false);
      Alert.alert("Agendamento atualizado", "O conteúdo da notificação foi alterado com sucesso.");
    } catch (error) {
      Alert.alert("Não foi possível atualizar", error instanceof Error ? error.message : "Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return <>
    <View style={styles.pending}>
      <View style={styles.pendingTop}><Image source={require("@/assets/images/icon.png")} style={styles.brandImage} /><View style={{ flex: 1 }}><Text style={styles.pendingTitle}>{item.title}</Text>{item.subtitle ? <Text style={styles.pendingSubtitle}>{item.subtitle}</Text> : null}<Text style={styles.pendingBody}>{item.body}</Text></View></View>
      <Text style={styles.pendingDate}>{item.scheduledAt ? new Date(item.scheduledAt).toLocaleString("pt-BR") : ""}</Text>
      <View style={styles.actions}><Pressable onPress={openEditor} style={styles.secondary}><IconSymbol name="square.and.pencil" size={17} color={teal} /><Text style={styles.secondaryText}>Editar</Text></Pressable><Pressable onPress={() => void cancel(item)} style={styles.secondary}><Text style={styles.secondaryText}>Cancelar</Text></Pressable><Pressable onPress={() => void remove(item)} style={styles.delete}><IconSymbol name="trash" size={19} color="#B44B47" /><Text style={{ color: "#B44B47", fontWeight: "800" }}>Excluir</Text></Pressable></View>
    </View>
    <Modal visible={editing} transparent animationType="slide" onRequestClose={() => !saving && setEditing(false)}>
      <View style={styles.modalBackdrop}><View style={styles.modalCard}><Text style={styles.modalTitle}>Editar agendamento</Text><Text style={styles.modalDate}>{item.scheduledAt ? `Será enviado em ${new Date(item.scheduledAt).toLocaleString("pt-BR")}` : ""}</Text><Field label="Título" value={editTitle} onChangeText={setEditTitle} placeholder="Título da notificação" /><Field label="Subtítulo (Opcional)" value={editSubtitle} onChangeText={setEditSubtitle} placeholder="Subtítulo da notificação" /><Field label="Mensagem" value={editBody} onChangeText={setEditBody} placeholder="Mensagem da notificação" multiline /><View style={styles.modalActions}><Pressable disabled={saving} onPress={() => setEditing(false)} style={styles.modalCancel}><Text style={styles.modalCancelText}>Cancelar</Text></Pressable><Pressable disabled={saving} onPress={() => void saveEdit()} style={[styles.modalSave, saving && { opacity: 0.65 }]}><Text style={styles.modalSaveText}>{saving ? "Salvando..." : "Salvar"}</Text></Pressable></View></View></View>
    </Modal>
  </>;
}
const styles = StyleSheet.create({ content: { padding: 20, paddingBottom: 40, gap: 16 }, heading: { color: ink, fontSize: 32, fontWeight: "900", marginTop: 8, marginBottom: 18 }, label: { color: ink, fontSize: 17, fontWeight: "800", marginBottom: 8 }, modelLabel: { color: ink, fontSize: 17, fontWeight: "800", marginTop: 2, marginBottom: -7 }, modelRow: { flexDirection: "row", gap: 12 }, modelButton: { flex: 1, minHeight: 52, borderWidth: 1, borderColor: teal, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#DFF3F1" }, modelButtonText: { color: teal, fontSize: 15, fontWeight: "800" }, field: { gap: 8 }, input: { backgroundColor: "#FFF", borderWidth: 1, borderColor: border, borderRadius: 18, minHeight: 58, paddingHorizontal: 18, color: ink, fontSize: 17 }, grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 }, choice: { width: "48%", minHeight: 60, borderWidth: 1, borderColor: border, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: bg }, choiceActive: { backgroundColor: teal }, choiceText: { fontSize: 17, color: ink }, button: { minHeight: 64, borderRadius: 22, backgroundColor: teal, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10, marginTop: 8 }, buttonText: { color: "#FFF", fontSize: 19, fontWeight: "900" }, sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14 }, section: { color: ink, fontSize: 24, fontWeight: "900" }, refreshButton: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 7, paddingHorizontal: 9, borderWidth: 1, borderColor: teal, borderRadius: 12, backgroundColor: "#DFF3F1" }, refreshText: { color: teal, fontSize: 13, fontWeight: "800" }, clearButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1, borderColor: "#E8B7B4", borderRadius: 14, paddingVertical: 12, backgroundColor: "#FFF8F7" }, clearText: { color: "#B44B47", fontSize: 14, fontWeight: "800" }, empty: { borderWidth: 1, borderColor: border, borderRadius: 22, padding: 24, alignItems: "center", gap: 8, backgroundColor: "#FFF" }, emptyText: { color: muted, fontSize: 16 }, pending: { backgroundColor: "#FFF", borderWidth: 1, borderColor: border, borderRadius: 22, padding: 18, gap: 11 }, pendingTop: { flexDirection: "row", gap: 12 }, pendingTitle: { color: ink, fontWeight: "800", fontSize: 17 }, pendingSubtitle: { color: ink, fontSize: 14, marginTop: 3 }, pendingBody: { color: muted, fontSize: 15, marginTop: 3 }, pendingDate: { color: muted, fontSize: 13 }, actions: { flexDirection: "row", gap: 10 }, brandImage: { width: 32, height: 32, borderRadius: 10 }, secondary: { borderWidth: 1, borderColor: teal, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 15 }, secondaryText: { color: teal, fontWeight: "800" }, delete: { borderWidth: 1, borderColor: "#E8B7B4", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 6 }, modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(18,27,36,0.45)" }, modalCard: { backgroundColor: "#FFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 30, gap: 12 }, modalTitle: { color: ink, fontSize: 24, fontWeight: "900" }, modalDate: { color: muted, fontSize: 14, marginBottom: 2 }, modalActions: { flexDirection: "row", gap: 12, marginTop: 4 }, modalCancel: { flex: 1, minHeight: 54, borderRadius: 16, borderWidth: 1, borderColor: teal, alignItems: "center", justifyContent: "center" }, modalCancelText: { color: teal, fontSize: 16, fontWeight: "800" }, modalSave: { flex: 1, minHeight: 54, borderRadius: 16, backgroundColor: teal, alignItems: "center", justifyContent: "center" }, modalSaveText: { color: "#FFF", fontSize: 16, fontWeight: "900" } });

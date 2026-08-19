import { Alert, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNotificationStore, type NotificationRecurrence } from "@/lib/notification-store";

const teal = "#0E8278";
const orange = "#F18400";
const bg = "#EAF4F8";
const ink = "#121B24";
const muted = "#667580";
const border = "#D4E0E5";

function formatDateSummary(value: Date): string {
  return value.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatTimeSummary(value: Date): string {
  return value.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatPixValue(value: string): string {
  const raw = value.trim().replace(/\s/g, "");
  if (!raw) return "";
  const hasComma = raw.includes(",");
  const dotParts = raw.split(".");
  const hasDecimalDot = !hasComma && dotParts.length === 2 && dotParts[1].length <= 2;
  let integerDigits = "";
  let centsDigits = "00";
  if (hasComma || hasDecimalDot) {
    const separator = hasComma ? "," : ".";
    const parts = raw.split(separator);
    integerDigits = (parts[0] ?? "").replace(/\D/g, "") || "0";
    centsDigits = (parts[1] ?? "").replace(/\D/g, "").slice(0, 2).padEnd(2, "0");
  } else {
    integerDigits = raw.replace(/\D/g, "") || "0";
  }
  integerDigits = integerDigits.replace(/^0+(?=\d)/, "") || "0";
  return `${integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${centsDigits}`;
}

export default function ScheduleScreen() {
  const { historyTitle, historySubtitle, historyBody, historyImageUri } = useLocalSearchParams<{ historyTitle?: string; historySubtitle?: string; historyBody?: string; historyImageUri?: string }>();
  const { schedule, records, selectedImage, refreshScheduled, clearScheduled } = useNotificationStore();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [minutes, setMinutes] = useState(1);
  const [timingMode, setTimingMode] = useState<"quick" | "custom">("quick");
  const [scheduledDate, setScheduledDate] = useState(() => new Date(Date.now() + 5 * 60_000));
  const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);
  const [recurrence, setRecurrence] = useState<NotificationRecurrence>("once");
  const [repeatWeekday, setRepeatWeekday] = useState(() => new Date(Date.now() + 5 * 60_000).getDay() + 1);
  const [receivedName, setReceivedName] = useState("");
  const [receivedValue, setReceivedValue] = useState("");
  const [sentName, setSentName] = useState("");
  const [sentValue, setSentValue] = useState("");
  const [draftImageUri, setDraftImageUri] = useState<string>();
  const pending = records.filter((item) => item.status === "pending");
  const notificationImageUri = draftImageUri || selectedImage;
  const weekdayOptions = [{ value: 1, label: "Dom" }, { value: 2, label: "Seg" }, { value: 3, label: "Ter" }, { value: 4, label: "Qua" }, { value: 5, label: "Qui" }, { value: 6, label: "Sex" }, { value: 7, label: "Sáb" }];
  const recurrenceLabel = recurrence === "daily" ? "Todos os dias" : recurrence === "weekly" ? `Toda semana, ${weekdayOptions.find((item) => item.value === repeatWeekday)?.label ?? "dia selecionado"}` : "Uma vez";

  useEffect(() => {
    if (historyTitle || historySubtitle || historyBody) {
      setTitle(historyTitle ?? "");
      setSubtitle(historySubtitle ?? "");
      setBody(historyBody ?? "");
      setDraftImageUri(historyImageUri || undefined);
    }
  }, [historyBody, historyImageUri, historySubtitle, historyTitle]);

  useEffect(() => { void refreshScheduled(); }, [refreshScheduled]);

  const buildPixPayload = (kind: "received" | "sent") => {
    const name = (kind === "received" ? receivedName : sentName).trim();
    const value = formatPixValue(kind === "received" ? receivedValue : sentValue);
    if (!name || !value) {
      Alert.alert("Preencha o modelo", "Informe o nome e o valor antes de usar este modelo Pix.");
      return null;
    }
    return kind === "received"
      ? { title: "Pix recebido", subtitle: "", body: `${name} te enviou um Pix de R$ ${value} creditado na sua conta final ***15448-3.` }
      : { title: "Pix enviado", subtitle: "", body: `Você fez um Pix no valor de R$ ${value} para ${name}.` };
  };

  const applyPixPreset = (kind: "received" | "sent") => {
    const payload = buildPixPayload(kind);
    if (!payload) return;
    if (kind === "received") setReceivedValue(formatPixValue(receivedValue));
    else setSentValue(formatPixValue(sentValue));
    setTitle(payload.title);
    setSubtitle(payload.subtitle);
    setBody(payload.body);
  };

  const schedulePixDirectly = async (kind: "received" | "sent") => {
    const payload = buildPixPayload(kind);
    if (!payload) return;
    const effectiveRecurrence: NotificationRecurrence = timingMode === "custom" ? recurrence : "once";
    const timing = timingMode === "custom" ? scheduledDate : minutes;
    if (timingMode === "custom" && scheduledDate.getTime() <= Date.now()) {
      Alert.alert("Horário inválido", "Escolha uma data e um horário futuros.");
      return;
    }
    try {
      await schedule({ ...payload, imageUri: notificationImageUri }, timing, effectiveRecurrence, repeatWeekday);
      Alert.alert("Pix agendado", timingMode === "custom" ? `${recurrenceLabel}: ${formatDateSummary(scheduledDate)} às ${formatTimeSummary(scheduledDate)}.` : `O Pix será emitido em ${minutes} minuto${minutes === 1 ? "" : "s"}.`);
      if (kind === "received") setReceivedValue(formatPixValue(receivedValue));
      else setSentValue(formatPixValue(sentValue));
      await refreshScheduled();
    } catch (error) {
      Alert.alert("Não foi possível agendar", error instanceof Error ? error.message : "Tente novamente.");
    }
  };

  const openPicker = (mode: "date" | "time") => {
    if (Platform.OS === "web") {
      Alert.alert("Disponível no iPhone", "A escolha nativa de data e horário estará disponível na IPA do SideStore.");
      return;
    }
    setPickerMode(mode);
  };

  const handlePickerChange = (event: DateTimePickerEvent, value?: Date) => {
    if (event.type === "dismissed" || !value) { setPickerMode(null); return; }
    const next = new Date(scheduledDate);
    if (pickerMode === "date") {
      next.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
    } else {
      next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    }
    setScheduledDate(next);
    setRepeatWeekday(next.getDay() + 1);
    setTimingMode("custom");
    setPickerMode(null);
  };

  const submit = async () => {
    if (!body.trim()) { Alert.alert("Preencha a notificação", "Use um modelo Pix ou informe a mensagem para agendar."); return; }
    const effectiveRecurrence: NotificationRecurrence = timingMode === "custom" ? recurrence : "once";
    const timing = timingMode === "custom" ? scheduledDate : minutes;
    if (timingMode === "custom" && scheduledDate.getTime() <= Date.now()) {
      Alert.alert("Horário inválido", "Escolha uma data e um horário futuros.");
      return;
    }
    try {
      await schedule({ title: title.trim() || "Notificação", subtitle: subtitle.trim(), body: body.trim(), imageUri: notificationImageUri }, timing, effectiveRecurrence, repeatWeekday);
      Alert.alert("Notificação agendada", timingMode === "custom" ? `${recurrenceLabel}: ${formatDateSummary(scheduledDate)} às ${formatTimeSummary(scheduledDate)}.` : `Ela será emitida em ${minutes} minuto${minutes === 1 ? "" : "s"}.`);
      setTitle(""); setSubtitle(""); setBody("");
      await refreshScheduled();
    } catch (error) {
      Alert.alert("Não foi possível agendar", error instanceof Error ? error.message : "Tente novamente.");
    }
  };

  return (
    <ScreenContainer containerClassName="bg-[#EAF4F8]">
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Agendar Notificação</Text>
        <Text style={styles.modelLabel}>Modelos rápidos</Text>
        <Text style={styles.modelHint}>EDITE E APLIQUE</Text>

        <QuickPresetCard
          kind="received"
          name={receivedName}
          value={receivedValue}
          onNameChange={setReceivedName}
          onValueChange={setReceivedValue}
          onSchedule={() => void schedulePixDirectly("received")}
          onApply={() => applyPixPreset("received")}
        />
        <QuickPresetCard
          kind="sent"
          name={sentName}
          value={sentValue}
          onNameChange={setSentName}
          onValueChange={setSentValue}
          onSchedule={() => void schedulePixDirectly("sent")}
          onApply={() => applyPixPreset("sent")}
        />

        <Text style={styles.label}>Quando enviar?</Text>
        <View style={styles.timingModeRow}>
          <Pressable onPress={() => setTimingMode("quick")} style={[styles.timingModeButton, timingMode === "quick" && styles.timingModeActive]}>
            <Text style={[styles.timingModeText, timingMode === "quick" && styles.timingModeTextActive]}>Intervalo rápido</Text>
          </Pressable>
          <Pressable onPress={() => setTimingMode("custom")} style={[styles.timingModeButton, timingMode === "custom" && styles.timingModeActive]}>
            <Text style={[styles.timingModeText, timingMode === "custom" && styles.timingModeTextActive]}>Data e horário</Text>
          </Pressable>
        </View>
        {timingMode === "quick" ? (
          <View style={styles.grid}>{[1, 5, 10, 30].map((value) => (
            <Pressable key={value} onPress={() => setMinutes(value)} style={[styles.choice, minutes === value && styles.choiceActive]}>
              <Text style={[styles.choiceText, minutes === value && { color: "#FFF" }]}>{value} minuto{value === 1 ? "" : "s"}</Text>
            </Pressable>
          ))}</View>
        ) : (
          <View style={styles.customTimingCard}>
            <Text style={styles.customTimingHint}>Escolha quando a notificação deverá aparecer no iPhone.</Text>
            <View style={styles.customTimingRow}>
              <Pressable onPress={() => openPicker("date")} style={styles.dateTimeButton}>
                <IconSymbol name="calendar" size={20} color={teal} />
                <View><Text style={styles.dateTimeCaption}>Data</Text><Text style={styles.dateTimeValue}>{formatDateSummary(scheduledDate)}</Text></View>
              </Pressable>
              <Pressable onPress={() => openPicker("time")} style={styles.dateTimeButton}>
                <IconSymbol name="clock" size={20} color={teal} />
                <View><Text style={styles.dateTimeCaption}>Horário</Text><Text style={styles.dateTimeValue}>{formatTimeSummary(scheduledDate)}</Text></View>
              </Pressable>
            </View>
            <Text style={styles.customTimingSummary}>{recurrence === "once" ? "Será enviado" : recurrenceLabel} em {formatDateSummary(scheduledDate)} às {formatTimeSummary(scheduledDate)}</Text>
            <Text style={styles.recurrenceLabel}>Repetição</Text>
            <View style={styles.recurrenceRow}>
              {([{ value: "once", label: "Uma vez" }, { value: "daily", label: "Diária" }, { value: "weekly", label: "Semanal" }] as const).map((option) => (
                <Pressable key={option.value} onPress={() => setRecurrence(option.value)} style={[styles.recurrenceButton, recurrence === option.value && styles.recurrenceButtonActive]}>
                  <Text style={[styles.recurrenceButtonText, recurrence === option.value && styles.recurrenceButtonTextActive]}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
            {recurrence === "weekly" && <View style={styles.weekdayRow}>{weekdayOptions.map((day) => (
              <Pressable key={day.value} onPress={() => setRepeatWeekday(day.value)} style={[styles.weekdayButton, repeatWeekday === day.value && styles.weekdayButtonActive]}>
                <Text style={[styles.weekdayText, repeatWeekday === day.value && styles.weekdayTextActive]}>{day.label}</Text>
              </Pressable>
            ))}</View>}
          </View>
        )}
        <Modal visible={pickerMode !== null} transparent animationType="fade" onRequestClose={() => setPickerMode(null)}>
          <View style={styles.pickerBackdrop}><View style={styles.pickerCard}>
            <Text style={styles.modalTitle}>{pickerMode === "date" ? "Escolha a data" : "Escolha o horário"}</Text>
            {pickerMode && <DateTimePicker value={scheduledDate} mode={pickerMode} display="spinner" minimumDate={pickerMode === "date" ? new Date() : undefined} onChange={handlePickerChange} themeVariant="light" />}
            <Pressable onPress={() => setPickerMode(null)} style={styles.pickerDone}><Text style={styles.pickerDoneText}>Concluir</Text></Pressable>
          </View></View>
        </Modal>

        <View style={styles.selectedSummary}>
          <Text style={styles.summaryTitle}>{title || "Modelo pronto para agendamento"}</Text>
          <Text style={styles.summaryBody}>{body || "Use um modelo Pix acima para preencher a notificação automaticamente."}</Text>
        </View>
        <Pressable onPress={submit} style={styles.button}>
          <IconSymbol name="calendar.badge.clock" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Agendar Agora</Text>
        </Pressable>

        <View style={styles.sectionHeader}><Text style={styles.section}>Agendamentos pendentes</Text><Pressable onPress={() => void refreshScheduled()} style={styles.refreshButton}><IconSymbol name="clock.arrow.circlepath" size={17} color={teal} /><Text style={styles.refreshText}>Atualizar</Text></Pressable></View>
        {pending.length > 0 && <Pressable onPress={() => Alert.alert("Cancelar agendamentos", "Deseja cancelar todos os agendamentos pendentes?", [{ text: "Não", style: "cancel" }, { text: "Cancelar todos", style: "destructive", onPress: () => void clearScheduled() }])} style={styles.clearButton}><IconSymbol name="trash" size={18} color="#B44B47" /><Text style={styles.clearText}>Cancelar todos os agendamentos</Text></Pressable>}
        {pending.length === 0 ? <View style={styles.empty}><IconSymbol name="calendar.badge.clock" size={30} color={muted} /><Text style={styles.emptyText}>Nenhum agendamento pendente.</Text></View> : pending.map((item) => <PendingCard key={item.id} item={item} />)}
      </ScrollView>
    </ScreenContainer>
  );
}

function QuickPresetCard({ kind, name, value, onNameChange, onValueChange, onSchedule, onApply }: { kind: "received" | "sent"; name: string; value: string; onNameChange: (value: string) => void; onValueChange: (value: string) => void; onSchedule: () => void; onApply: () => void }) {
  const received = kind === "received";
  return <>
    <View style={styles.presetsCard}>
      <View style={styles.presetHeader}>
        <View style={[styles.presetIcon, !received && styles.presetIconSent]}><MaterialIcons name={received ? "south-west" : "north-east"} size={22} color="#FFF" /></View>
        <View style={{ flex: 1 }}><Text style={styles.presetTitle}>Pix {received ? "recebido" : "enviado"}</Text><Text style={styles.presetDescription}>{received ? "Notificação de valor creditado." : "Notificação de transferência realizada."}</Text></View>
      </View>
      <View style={styles.presetInputsRow}>
        <TextInput value={name} onChangeText={onNameChange} placeholder={received ? "Digite o nome de quem enviou" : "Digite o nome de quem recebeu"} placeholderTextColor="#87949C" style={styles.presetInput} maxLength={70} />
        <TextInput value={value} onChangeText={onValueChange} onBlur={() => onValueChange(formatPixValue(value))} placeholder="Valor da transação" placeholderTextColor="#87949C" style={styles.presetValueInput} maxLength={15} keyboardType="decimal-pad" />
      </View>
    </View>
    <View style={styles.presetActionPanel}>
      <TouchableOpacity onPress={onSchedule} activeOpacity={0.8} style={styles.directPresetButton} accessibilityRole="button" accessibilityLabel={`Agendar Pix ${received ? "recebido" : "enviado"}`}>
        <Text style={styles.directPresetText}>Agendar Pix {received ? "recebido" : "enviado"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onApply} activeOpacity={0.8} style={styles.applyPresetButton} accessibilityRole="button" accessibilityLabel={`Usar Pix ${received ? "recebido" : "enviado"}`}>
        <Text style={styles.applyPresetText}>Usar Pix {received ? "recebido" : "enviado"}</Text>
      </TouchableOpacity>
    </View>
  </>;
}

function Field({ label, value, onChangeText, placeholder, multiline = false }: { label: string; value: string; onChangeText: (v: string) => void; placeholder: string; multiline?: boolean }) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#B7C0C5" multiline={multiline} textAlignVertical={multiline ? "top" : "center"} style={[styles.input, multiline && { minHeight: 110, paddingTop: 15 }]} /></View>; }

function formatPendingRecurrence(item: import("@/lib/notification-store").NotificationRecord) {
  if (item.recurrence === "daily") return "Repete diariamente";
  if (item.recurrence === "weekly") {
    const days = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    return `Repete toda ${days[(item.repeatWeekday ?? 1) - 1] ?? "semana"}`;
  }
  return "Agendamento único";
}

function PendingCard({ item }: { item: import("@/lib/notification-store").NotificationRecord }) {
  const { cancel, remove, updateScheduled } = useNotificationStore();
  const [editing, setEditing] = useState(false); const [saving, setSaving] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title); const [editSubtitle, setEditSubtitle] = useState(item.subtitle); const [editBody, setEditBody] = useState(item.body);
  const openEditor = () => { setEditTitle(item.title); setEditSubtitle(item.subtitle); setEditBody(item.body); setEditing(true); };
  const saveEdit = async () => { const nextBody = editBody.trim(); if (!nextBody) { Alert.alert("Mensagem obrigatória", "Informe a mensagem da notificação."); return; } setSaving(true); try { await updateScheduled(item, { title: editTitle.trim() || "Notificação", subtitle: editSubtitle.trim(), body: nextBody, imageUri: item.imageUri }); setEditing(false); Alert.alert("Agendamento atualizado", "O conteúdo da notificação foi alterado com sucesso."); } catch (error) { Alert.alert("Não foi possível atualizar", error instanceof Error ? error.message : "Tente novamente."); } finally { setSaving(false); } };
  return <>
    <View style={styles.pending}><View style={styles.pendingTop}><Image source={require("@/assets/images/icon.png")} style={styles.brandImage} /><View style={{ flex: 1 }}><Text style={styles.pendingTitle}>{item.title}</Text>{item.subtitle ? <Text style={styles.pendingSubtitle}>{item.subtitle}</Text> : null}<Text style={styles.pendingBody}>{item.body}</Text></View></View><Text style={styles.pendingDate}>{formatPendingRecurrence(item)}{item.scheduledAt ? ` • ${new Date(item.scheduledAt).toLocaleString("pt-BR")}` : ""}</Text>
<View style={styles.actions}><Pressable onPress={openEditor} style={styles.secondary}><IconSymbol name="square.and.pencil" size={17} color={teal} /><Text style={styles.secondaryText}>Editar</Text></Pressable><Pressable onPress={() => void cancel(item)} style={styles.secondary}><Text style={styles.secondaryText}>Cancelar</Text></Pressable><Pressable onPress={() => void remove(item)} style={styles.delete}><IconSymbol name="trash" size={19} color="#B44B47" /><Text style={{ color: "#B44B47", fontWeight: "800" }}>Excluir</Text></Pressable></View></View>
    <Modal visible={editing} transparent animationType="slide" onRequestClose={() => !saving && setEditing(false)}><View style={styles.modalBackdrop}><View style={styles.modalCard}><Text style={styles.modalTitle}>Editar agendamento</Text><Text style={styles.modalDate}>{item.scheduledAt ? `Será enviado em ${new Date(item.scheduledAt).toLocaleString("pt-BR")}` : ""}</Text><Field label="Título" value={editTitle} onChangeText={setEditTitle} placeholder="Título da notificação" /><Field label="Subtítulo (Opcional)" value={editSubtitle} onChangeText={setEditSubtitle} placeholder="Subtítulo da notificação" /><Field label="Mensagem" value={editBody} onChangeText={setEditBody} placeholder="Mensagem da notificação" multiline /><View style={styles.modalActions}><Pressable disabled={saving} onPress={() => setEditing(false)} style={styles.modalCancel}><Text style={styles.modalCancelText}>Cancelar</Text></Pressable><Pressable disabled={saving} onPress={() => void saveEdit()} style={[styles.modalSave, saving && { opacity: 0.65 }]}><Text style={styles.modalSaveText}>{saving ? "Salvando..." : "Salvar"}</Text></Pressable></View></View></View></Modal>
  </>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  heading: { color: ink, fontSize: 32, fontWeight: "900", marginTop: 8, marginBottom: 8 },
  label: { color: ink, fontSize: 17, fontWeight: "800", marginBottom: 8 },
  modelLabel: { color: ink, fontSize: 24, fontWeight: "900", marginTop: 2, marginBottom: -9 },
  modelHint: { color: muted, fontSize: 13, letterSpacing: 2, fontWeight: "800", marginBottom: 0 },
  presetsCard: { backgroundColor: "#FFF", borderWidth: 1, borderColor: border, borderRadius: 24, padding: 20, gap: 16 },
  presetHeader: { flexDirection: "row", alignItems: "center", gap: 14 },
  presetIcon: { width: 58, height: 58, borderRadius: 18, backgroundColor: teal, alignItems: "center", justifyContent: "center" },
  presetIconSent: { backgroundColor: "#163D59" },
  presetTitle: { color: ink, fontSize: 24, fontWeight: "900" },
  presetDescription: { color: muted, fontSize: 16, marginTop: 3 },
  presetInputsRow: { flexDirection: "row", gap: 12 },
  presetInput: { flex: 1, minWidth: 0, flexShrink: 1, minHeight: 58, borderWidth: 1, borderColor: border, borderRadius: 18, paddingHorizontal: 16, color: ink, fontSize: 16 },
  presetValueInput: { width: 118, minWidth: 0, flexShrink: 1, minHeight: 58, borderWidth: 1, borderColor: border, borderRadius: 18, paddingHorizontal: 12, color: ink, fontSize: 16 },
  presetActionPanel: { backgroundColor: "#F4FBFC", borderWidth: 1, borderColor: border, borderRadius: 22, padding: 13, gap: 12 },
  directPresetButton: { minHeight: 58, borderRadius: 18, backgroundColor: orange, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  directPresetText: { color: "#FFF", fontSize: 17, fontWeight: "900", textAlign: "center" },
  applyPresetButton: { minHeight: 58, borderRadius: 18, backgroundColor: teal, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  applyPresetText: { color: "#FFF", fontSize: 17, fontWeight: "900", textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  choice: { width: "48%", minHeight: 60, borderWidth: 1, borderColor: border, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: bg },
  choiceActive: { backgroundColor: teal }, choiceText: { fontSize: 17, color: ink },
  timingModeRow: { flexDirection: "row", gap: 10 }, timingModeButton: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: border, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF" }, timingModeActive: { backgroundColor: teal, borderColor: teal }, timingModeText: { color: teal, fontSize: 14, fontWeight: "800" }, timingModeTextActive: { color: "#FFF" },
  customTimingCard: { backgroundColor: "#FFF", borderWidth: 1, borderColor: border, borderRadius: 20, padding: 16, gap: 14 }, customTimingHint: { color: muted, fontSize: 14, lineHeight: 19 }, customTimingRow: { flexDirection: "row", gap: 10 }, dateTimeButton: { flex: 1, minHeight: 66, borderWidth: 1, borderColor: "#B8DAD6", borderRadius: 16, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: "#F5FCFB" }, dateTimeCaption: { color: muted, fontSize: 12, fontWeight: "700" }, dateTimeValue: { color: ink, fontSize: 16, fontWeight: "900", marginTop: 2 },   customTimingSummary: { color: teal, fontSize: 14, fontWeight: "800" },
  recurrenceLabel: { color: ink, fontSize: 14, fontWeight: "900", marginTop: 2 },
  recurrenceRow: { flexDirection: "row", gap: 8 },
  recurrenceButton: { flex: 1, minHeight: 46, borderWidth: 1, borderColor: border, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF" },
  recurrenceButtonActive: { backgroundColor: teal, borderColor: teal },
  recurrenceButtonText: { color: teal, fontSize: 14, fontWeight: "800" },
  recurrenceButtonTextActive: { color: "#FFF" },
  weekdayRow: { flexDirection: "row", justifyContent: "space-between", gap: 6 },
  weekdayButton: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: border, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF" },
  weekdayButtonActive: { backgroundColor: orange, borderColor: orange },
  weekdayText: { color: teal, fontSize: 12, fontWeight: "900" },
  weekdayTextActive: { color: "#FFF" },

  pickerBackdrop: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "rgba(18,27,36,0.45)" }, pickerCard: { backgroundColor: "#FFF", borderRadius: 26, padding: 20, alignItems: "center", gap: 14 }, pickerDone: { width: "100%", minHeight: 52, borderRadius: 16, backgroundColor: teal, alignItems: "center", justifyContent: "center" }, pickerDoneText: { color: "#FFF", fontSize: 16, fontWeight: "900" },
  selectedSummary: { backgroundColor: "#FFF", borderWidth: 1, borderColor: border, borderRadius: 18, padding: 16, gap: 4 },
  summaryTitle: { color: ink, fontSize: 16, fontWeight: "900" }, summaryBody: { color: muted, fontSize: 14, lineHeight: 20 },
  button: { minHeight: 64, borderRadius: 22, backgroundColor: teal, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10, marginTop: 2 }, buttonText: { color: "#FFF", fontSize: 19, fontWeight: "900" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14 }, section: { color: ink, fontSize: 24, fontWeight: "900" },
  refreshButton: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 7, paddingHorizontal: 9, borderWidth: 1, borderColor: teal, borderRadius: 12, backgroundColor: "#DFF3F1" }, refreshText: { color: teal, fontSize: 13, fontWeight: "800" },
  clearButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1, borderColor: "#E8B7B4", borderRadius: 14, paddingVertical: 12, backgroundColor: "#FFF8F7" }, clearText: { color: "#B44B47", fontSize: 14, fontWeight: "800" },
  empty: { borderWidth: 1, borderColor: border, borderRadius: 22, padding: 24, alignItems: "center", gap: 8, backgroundColor: "#FFF" }, emptyText: { color: muted, fontSize: 16 },
  pending: { backgroundColor: "#FFF", borderWidth: 1, borderColor: border, borderRadius: 22, padding: 18, gap: 11 }, pendingTop: { flexDirection: "row", gap: 12 }, pendingTitle: { color: ink, fontWeight: "800", fontSize: 17 }, pendingSubtitle: { color: ink, fontSize: 14, marginTop: 3 }, pendingBody: { color: muted, fontSize: 15, marginTop: 3 }, pendingDate: { color: muted, fontSize: 13 }, actions: { flexDirection: "row", gap: 10 }, brandImage: { width: 32, height: 32, borderRadius: 10 },
  secondary: { borderWidth: 1, borderColor: teal, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 15 }, secondaryText: { color: teal, fontWeight: "800" }, delete: { borderWidth: 1, borderColor: "#E8B7B4", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 6 },
  field: { gap: 8 }, input: { backgroundColor: "#FFF", borderWidth: 1, borderColor: border, borderRadius: 18, minHeight: 58, paddingHorizontal: 18, color: ink, fontSize: 17 },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(18,27,36,0.45)" }, modalCard: { backgroundColor: "#FFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 30, gap: 12 }, modalTitle: { color: ink, fontSize: 24, fontWeight: "900" }, modalDate: { color: muted, fontSize: 14, marginBottom: 2 }, modalActions: { flexDirection: "row", gap: 12, marginTop: 4 },   modalCancel: { flex: 1, minHeight: 54, borderRadius: 16, borderWidth: 1, borderColor: teal, alignItems: "center", justifyContent: "center" }, modalCancelText: { color: teal, fontSize: 16, fontWeight: "800" }, modalSave: { flex: 1, minHeight: 54, borderRadius: 16, backgroundColor: teal, alignItems: "center", justifyContent: "center" }, modalSaveText: { color: "#FFF", fontSize: 16, fontWeight: "900" },

});

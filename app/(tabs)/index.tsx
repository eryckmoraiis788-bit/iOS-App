import { useEffect, useRef, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNotificationStore, type NotificationTemplate } from "@/lib/notification-store";

const colors = {
  bg: "#EAF4F8",
  ink: "#121B24",
  muted: "#667580",
  teal: "#0E8278",
  navy: "#102F49",
  white: "#FFFFFF",
  border: "#D4E0E5",
  green: "#3CA77A",
};

const appIcon = require("@/assets/images/icon.png");

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
  const groupedInteger = integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${groupedInteger},${centsDigits}`;
}


type FieldProps = {
  label: string;
  value: string;
  placeholder: string;
  maxLength: number;
  onChangeText: (value: string) => void;
  multiline?: boolean;
};

export default function ComposeScreen() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [modelName, setModelName] = useState("");
  const [receivedName, setReceivedName] = useState("");
  const [receivedValue, setReceivedValue] = useState("");
  const [sentName, setSentName] = useState("");
  const [sentValue, setSentValue] = useState("");
  const [isEmitting, setIsEmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isSavingModel, setIsSavingModel] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string>();
  const [pendingDelete, setPendingDelete] = useState<NotificationTemplate | null>(null);
  const [feedback, setFeedback] = useState<"saved" | "emitted" | "save-error" | "emit-error" | null>(null);
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const feedbackScale = useRef(new Animated.Value(0.82)).current;
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const entranceProgress = useRef(new Animated.Value(0)).current;
  const { selectedImage, emit, templates, saveTemplate, removeTemplate } = useNotificationStore();
  const canEmit = title.trim().length > 0 && body.trim().length > 0;
  const canSaveModel = body.trim().length > 0;

  const showSuccessFeedback = (kind: "saved" | "emitted") => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback(kind);
    feedbackOpacity.setValue(0);
    feedbackScale.setValue(0.82);
    Animated.parallel([
      Animated.timing(feedbackOpacity, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(feedbackScale, { toValue: 1, friction: 7, tension: 90, useNativeDriver: true }),
    ]).start();
    feedbackTimer.current = setTimeout(() => {
      Animated.timing(feedbackOpacity, { toValue: 0, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(() => setFeedback(null));
    }, 2200);
  };

  const showErrorFeedback = (kind: "save-error" | "emit-error") => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback(kind);
    feedbackOpacity.setValue(0);
    feedbackScale.setValue(0.82);
    Animated.parallel([
      Animated.timing(feedbackOpacity, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(feedbackScale, { toValue: 1, friction: 7, tension: 90, useNativeDriver: true }),
    ]).start();
    feedbackTimer.current = setTimeout(() => {
      Animated.timing(feedbackOpacity, { toValue: 0, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(() => setFeedback(null));
    }, 3000);
  };

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }, []);

  useEffect(() => {
    Animated.timing(entranceProgress, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entranceProgress]);

  const handleSaveModel = async (): Promise<boolean> => {
    if (isSavingModel) return false;
    setIsSavingModel(true);
    const trimmedName = modelName.trim();
    const trimmedBody = body.trim();
    const resolvedName = trimmedName || title.trim() || "Modelo sem nome";
    if (!trimmedBody) {
      setSaveMessage("Informe a mensagem antes de salvar o modelo.");
      showErrorFeedback("save-error");
      setIsSavingModel(false);
      return false;
    }
    try {
      await saveTemplate({
        name: resolvedName,
        title: title.trim() || resolvedName,
        subtitle: subtitle.trim(),
        body: trimmedBody,
      }, editingTemplateId);
      setSaveMessage(editingTemplateId ? "Modelo atualizado nesta tela." : "Modelo salvo nesta tela.");
      showSuccessFeedback("saved");
      setModelName("");
      setEditingTemplateId(undefined);
      setIsSavingModel(false);
      return true;
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Não foi possível salvar o modelo neste iPhone.";
      setSaveMessage(detail);
      showErrorFeedback("save-error");
      setIsSavingModel(false);
      return false;
    }
  };

  const applyPixPreset = (kind: "received" | "sent") => {
    const name = (kind === "received" ? receivedName : sentName).trim();
    const value = (kind === "received" ? receivedValue : sentValue).trim();

    if (!name || !value) {
      setSaveMessage("Informe o nome e o valor do modelo antes de aplicar.");
      showErrorFeedback("save-error");
      return;
    }

    // Monte o conteúdo antes de atualizar o estado para garantir que o mesmo
    // conjunto de dados seja transferido para todos os campos controlados.
    const nextTitle = kind === "received" ? "Pix recebido" : "Pix enviado";
    const nextBody = kind === "received"
      ? `${name} te enviou um Pix de R$ ${value} creditado na sua conta final ***15448-3.`
      : `Você fez um Pix no valor de R$ ${value} para ${name}.`;

    if (kind === "received") setReceivedValue(value);
    else setSentValue(value);
    setTitle(nextTitle);
    setSubtitle("");
    setBody(nextBody);
    setModelName("");
    setEditingTemplateId(undefined);
    setSaveMessage(kind === "received" ? "Modelo Pix recebido aplicado." : "Modelo Pix enviado aplicado.");
  };

  const emitPixDirectly = async (kind: "received" | "sent") => {
    if (isEmitting || isSavingModel) return;

    const name = (kind === "received" ? receivedName : sentName).trim();
    const rawValue = (kind === "received" ? receivedValue : sentValue).trim();
    const value = formatPixValue(rawValue);
    if (!name || !rawValue) {
      setSaveMessage("Informe o nome e o valor antes de emitir o Pix.");
      showErrorFeedback("emit-error");
      return;
    }

    const nextTitle = kind === "received" ? "Pix recebido" : "Pix enviado";
    const nextBody = kind === "received"
      ? `${name} te enviou um Pix de R$ ${value} creditado na sua conta final ***15448-3.`
      : `Você fez um Pix no valor de R$ ${value} para ${name}.`;

    // Atualiza o formulário para que a pré-visualização reflita exatamente
    // a mesma notificação que será emitida neste toque.
    if (kind === "received") setReceivedValue(value);
    else setSentValue(value);
    setTitle(nextTitle);
    setSubtitle("");
    setBody(nextBody);
    setModelName("");
    setEditingTemplateId(undefined);
    setIsEmitting(true);

    try {
      const emitted = await emit({ title: nextTitle, subtitle: "", body: nextBody, imageUri: selectedImage });
      if (emitted) {
        setSaveMessage(kind === "received" ? "Pix recebido emitido." : "Pix enviado emitido.");
        showSuccessFeedback("emitted");
      } else {
        showErrorFeedback("emit-error");
      }
    } catch (error) {
      const detail = error instanceof Error && error.message ? error.message : "Não foi possível emitir esta notificação.";
      setSaveMessage(detail);
      showErrorFeedback("emit-error");
    } finally {
      setIsEmitting(false);
    }
  };

  const handleEmit = () => {
    if (isEmitting || isSavingModel) return;
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle || !trimmedBody) {
      showErrorFeedback("emit-error");
      return;
    }
    void confirmEmit();
  };

  const confirmEmit = async () => {
    if (isEmitting) return;
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    setIsEmitting(true);
    try {
      if (modelName.trim()) {
        const saved = await handleSaveModel();
        if (!saved) return;
      }
      const emitted = await emit({ title: trimmedTitle, subtitle: subtitle.trim(), body: trimmedBody, imageUri: selectedImage });
      if (emitted) {
        showSuccessFeedback("emitted");
      } else {
        showErrorFeedback("emit-error");
      }
    } catch (error) {
      const detail = error instanceof Error && error.message ? error.message : "O iOS recusou o agendamento da notificação.";
      showErrorFeedback("emit-error");
      setSaveMessage(detail);
    } finally {
      setIsEmitting(false);
    }
  };

  return (
    <>
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator
      alwaysBounceVertical
      bounces
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="never"
    >
      {feedback && (
        <Animated.View style={[styles.successToast, feedback.endsWith("error") && styles.errorToast, { opacity: feedbackOpacity, transform: [{ scale: feedbackScale }] }]} accessibilityLiveRegion="polite">
          <View style={[styles.successToastIcon, feedback.endsWith("error") && styles.errorToastIcon]}>
            <MaterialIcons name={feedback.endsWith("error") ? "priority-high" : "check"} size={20} color={colors.white} />
          </View>
          <View style={styles.flexCopy}>
            <Text style={styles.successToastTitle}>{feedback === "saved" ? "Modelo salvo" : feedback === "emitted" ? "Notificação emitida" : feedback === "save-error" ? "Falha ao salvar" : "Falha ao emitir"}</Text>
            <Text style={styles.successToastBody}>{feedback === "saved" ? "Sua predefinição foi guardada nesta tela." : feedback === "emitted" ? "A mensagem foi enviada para o iPhone." : feedback === "save-error" ? "Não foi possível guardar o modelo. Tente novamente." : "A mensagem não foi enviada. Verifique os dados e tente novamente."}</Text>
          </View>
        </Animated.View>
      )}

      <Animated.View
        style={{
          opacity: entranceProgress,
          transform: [{ translateY: entranceProgress.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
        }}
      >
        <View style={styles.header}>
          <Image source={appIcon} style={styles.headerLogo} />
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>COMPOSITOR</Text>
            <Text style={styles.heading}>Criar notificação</Text>
          </View>
          <View style={styles.statusDot} />
        </View>

        <View style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={styles.heroIcon}>
            <MaterialIcons name="notifications-none" size={34} color={colors.white} />
          </View>
          <Text style={styles.heroEyebrow}>PRONTA PARA CHEGAR</Text>
        </View>
        <Text style={styles.heroTitle}>Uma mensagem, no momento certo.</Text>
          <Text style={styles.heroBody}>
            Escreva uma notificação clara e veja como ela ficará antes de emitir.
          </Text>
        </View>
      </Animated.View>

      <View style={styles.readyCard}>
        <View style={styles.readyIcon}>
          <MaterialIcons name="check-circle" size={31} color={colors.green} />
        </View>
        <View style={styles.flexCopy}>
          <Text style={styles.cardTitle}>Notificações prontas</Text>
          <Text style={styles.cardBody}>Você pode emitir uma notificação a qualquer momento.</Text>
        </View>
        <MaterialIcons name="chevron-right" size={30} color={colors.muted} />
      </View>

      <View style={styles.sectionHeadingRow}>
        <Text style={styles.sectionTitle}>Conteúdo</Text>
        <Text style={styles.sectionLabel}>PERSONALIZE</Text>
      </View>

      <View style={styles.formCard}>
        <Field label="Nome exibido" value={title} onChangeText={setTitle} placeholder="Ex.: Inter" maxLength={40} />
        <Field label="Subtítulo (Opcional)" value={subtitle} onChangeText={setSubtitle} placeholder="Ex.: Transação confirmada" maxLength={80} />
        <Field label="Mensagem" value={body} onChangeText={setBody} placeholder="Ex.: Pix recebido" maxLength={140} multiline />
      </View>

      <Pressable style={({ pressed }) => [styles.optionCard, pressed && styles.pressed]}>
        <View style={styles.optionIcon}>
          <MaterialIcons name="add-photo-alternate" size={31} color={colors.teal} />
        </View>
        <View style={styles.flexCopy}>
          <Text style={styles.cardTitle}>Imagem da notificação</Text>
          <Text style={styles.cardBody}>Escolha uma imagem para o preview.</Text>
        </View>
        <MaterialIcons name="chevron-right" size={30} color={colors.muted} />
      </Pressable>

      <View style={styles.modelsHeading}>
        <View>
          <Text style={styles.sectionTitle}>Modelos predefinidos</Text>
          <Text style={styles.sectionLabel}>SALVE PARA USAR DE NOVO</Text>
        </View>
        <Pressable
          onPress={handleSaveModel}
          disabled={isSavingModel || isEmitting}
          hitSlop={14}
          accessibilityRole="button"
          accessibilityLabel="Salvar modelo predefinido"
          testID="save-template-header-button"
          style={({ pressed }) => [styles.bookmarkAction, pressed && styles.pressed]}
        >
          {isSavingModel ? <ActivityIndicator size="small" color={colors.teal} /> : <MaterialIcons name="bookmark-border" size={27} color={colors.teal} />}
        </Pressable>
      </View>

      <View style={styles.modelsCard}>
        <View style={styles.modelRow}>
          <TextInput value={modelName} onChangeText={(value) => { setModelName(value); setSaveMessage(""); }} placeholder="Nome do modelo (opcional)" placeholderTextColor="#87949C" style={styles.modelInput} maxLength={40} />
          <Pressable onPress={handleSaveModel} disabled={isSavingModel || isEmitting || !canSaveModel} hitSlop={12} style={({ pressed }) => [styles.saveButton, canSaveModel ? styles.saveReady : styles.saveDisabled, (pressed || isSavingModel) && styles.pressed]} accessibilityRole="button" accessibilityLabel={isSavingModel ? "Salvando modelo" : "Salvar modelo"} testID="save-template-button">
            {isSavingModel ? <ActivityIndicator size="small" color={colors.white} /> : <MaterialIcons name="bookmark" size={23} color={colors.white} />}
            <Text style={styles.saveText}>{isSavingModel ? "Salvando…" : "Salvar"}</Text>
          </Pressable>
        </View>
        <Text style={styles.modelHint}>{editingTemplateId ? "Edite os campos e salve para atualizar este modelo." : "Seus modelos salvos aparecerão aqui."}</Text>
        {!!saveMessage && <Text style={styles.saveMessage}>{saveMessage}</Text>}
      </View>

      <View style={styles.presetsHeading}>
        <View style={styles.flexCopy}>
          <Text style={styles.sectionTitle}>Modelos rápidos</Text>
          <Text style={styles.sectionLabel}>EDITE E APLIQUE</Text>
        </View>
        <MaterialIcons name="bolt" size={25} color={colors.teal} />
      </View>

      <View style={styles.presetsCard}>
        <View style={styles.presetHeader}>
          <View style={styles.presetIcon}><MaterialIcons name="south-west" size={22} color={colors.white} /></View>
          <View style={styles.flexCopy}>
            <Text style={styles.presetTitle}>Pix recebido</Text>
            <Text style={styles.presetDescription}>Notificação de valor creditado.</Text>
          </View>
        </View>
        <View style={styles.presetInputsRow}>
          <TextInput value={receivedName} onChangeText={setReceivedName} placeholder="Digite o nome de quem enviou" placeholderTextColor="#87949C" style={styles.presetInput} maxLength={70} />
          <TextInput value={receivedValue} onChangeText={setReceivedValue} onBlur={() => setReceivedValue(formatPixValue(receivedValue))} placeholder="Valor da transação" placeholderTextColor="#87949C" style={styles.presetValueInput} maxLength={15} keyboardType="decimal-pad" />
        </View>
      </View>
      <View style={styles.presetActionPanel}>
        <TouchableOpacity onPress={() => void emitPixDirectly("received")} disabled={isEmitting || isSavingModel} activeOpacity={0.8} style={[styles.directPresetButton, isEmitting && styles.emittingButton]} accessibilityRole="button" accessibilityLabel="Emitir Pix recebido agora" testID="emit-pix-received-button">
          <Text style={styles.directPresetText}>{isEmitting ? "Emitindo Pix recebido..." : "Emitir Pix recebido"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => applyPixPreset("received")} activeOpacity={0.8} style={styles.applyPresetButton} accessibilityRole="button" accessibilityLabel="Preencher formulário com Pix recebido" testID="apply-pix-received-button">
          <Text style={styles.applyPresetText}>Usar Pix recebido</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.presetsCard}>
        <View style={styles.presetHeader}>
          <View style={[styles.presetIcon, styles.presetIconSent]}><MaterialIcons name="north-east" size={22} color={colors.white} /></View>
          <View style={styles.flexCopy}>
            <Text style={styles.presetTitle}>Pix enviado</Text>
            <Text style={styles.presetDescription}>Notificação de transferência realizada.</Text>
          </View>
        </View>
        <View style={styles.presetInputsRow}>
          <TextInput value={sentName} onChangeText={setSentName} placeholder="Digite o nome de quem recebeu" placeholderTextColor="#87949C" style={styles.presetInput} maxLength={70} />
          <TextInput value={sentValue} onChangeText={setSentValue} onBlur={() => setSentValue(formatPixValue(sentValue))} placeholder="Valor da transação" placeholderTextColor="#87949C" style={styles.presetValueInput} maxLength={15} keyboardType="decimal-pad" />
        </View>
      </View>
      <View style={styles.presetActionPanel}>
        <TouchableOpacity onPress={() => void emitPixDirectly("sent")} disabled={isEmitting || isSavingModel} activeOpacity={0.8} style={[styles.directPresetButton, isEmitting && styles.emittingButton]} accessibilityRole="button" accessibilityLabel="Emitir Pix enviado agora" testID="emit-pix-sent-button">
          <Text style={styles.directPresetText}>{isEmitting ? "Emitindo Pix enviado..." : "Emitir Pix enviado"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => applyPixPreset("sent")} activeOpacity={0.8} style={styles.applyPresetButton} accessibilityRole="button" accessibilityLabel="Preencher formulário com Pix enviado" testID="apply-pix-sent-button">
          <Text style={styles.applyPresetText}>Usar Pix enviado</Text>
        </TouchableOpacity>
      </View>

      {templates.length > 0 && (
        <View style={styles.savedModelsCard}>
          <View style={styles.savedModelsHeader}>
            <Text style={styles.savedModelsTitle}>Salvos nesta tela</Text>
            <Text style={styles.savedModelsCount}>{templates.length}</Text>
          </View>
          {templates.map((template) => (
            <View key={template.id} style={styles.savedModelRow}>
              <View style={styles.flexCopy}>
                <Text style={styles.savedModelName}>{template.name}</Text>
                <Text style={styles.savedModelBody} numberOfLines={1}>{template.body}</Text>
              </View>
              <Pressable onPress={() => { setModelName(template.name); setTitle(template.title); setSubtitle(template.subtitle); setBody(template.body); setEditingTemplateId(template.id); setSaveMessage("Modelo carregado para edição."); }} style={styles.smallAction} accessibilityRole="button" accessibilityLabel={`Editar ${template.name}`}>
                <MaterialIcons name="edit" size={20} color={colors.teal} />
              </Pressable>
              <Pressable onPress={() => setPendingDelete(template)} style={styles.smallAction} accessibilityRole="button" accessibilityLabel={`Excluir ${template.name}`}>
                <MaterialIcons name="delete-outline" size={21} color="#B64B4B" />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {pendingDelete && (
        <View style={styles.confirmCard}>
          <Text style={styles.confirmTitle}>Excluir este modelo?</Text>
          <Text style={styles.confirmBody}>“{pendingDelete.name}” será removido desta tela.</Text>
          <View style={styles.confirmActions}>
            <Pressable onPress={() => setPendingDelete(null)} style={[styles.confirmButton, styles.cancelButton]} accessibilityRole="button"><Text style={styles.cancelText}>Cancelar</Text></Pressable>
            <Pressable onPress={async () => { const item = pendingDelete; setPendingDelete(null); await removeTemplate(item); setSaveMessage("Modelo excluído."); }} style={[styles.confirmButton, styles.deleteButton]} accessibilityRole="button"><Text style={styles.deleteText}>Excluir</Text></Pressable>
          </View>
        </View>
      )}

      <View style={styles.previewHeading}>
        <Text style={styles.sectionTitle}>Pré-visualização</Text>
        <Text style={styles.nowLabel}><Text style={styles.greenDot}>●</Text> AGORA</Text>
      </View>

      <View style={styles.previewOuter}>
        <View style={styles.preview}>
          <View style={styles.previewIcon}>
            <MaterialIcons name="notifications-none" size={30} color={colors.white} />
          </View>
          <View style={styles.flexCopy}>
            <View style={styles.previewTop}>
              <Text style={styles.previewTitle}>{title || "Nome exibido"}</Text>
              <Text style={styles.previewTime}>agora</Text>
            </View>
            <Text style={styles.previewSubtitle}>{subtitle || "O assunto aparecerá aqui antes do envio."}</Text>
            {!!body && <Text style={styles.previewBody}>{body}</Text>}
          </View>
        </View>
      </View>

      <View style={[styles.buttonShell, canEmit ? styles.primaryButtonReady : styles.primaryButtonDisabled]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Emitir notificação"
          onPress={handleEmit}
          disabled={isEmitting || isSavingModel}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
            isEmitting && styles.emittingButton,
          ]}
        >
          <View style={styles.primaryIconSlot}>
            {isEmitting ? <ActivityIndicator size="small" color={colors.white} /> : <MaterialIcons name="notifications-none" size={28} color={colors.white} />}
          </View>
          <Text style={styles.primaryText}>{isEmitting ? "Enviando…" : "Emitir notificação"}</Text>
        </Pressable>
      </View>
    </ScrollView>


    </>
  );
}

function Field({ label, value, placeholder, maxLength, onChangeText, multiline = false }: FieldProps) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.counter}>{value.length}/{maxLength}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#667580"
        maxLength={maxLength}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.textArea]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, padding: 20, paddingBottom: 180, gap: 18 },

  confirmOverlay: { flex: 1, backgroundColor: "rgba(11, 28, 39, 0.58)", alignItems: "center", justifyContent: "center", paddingHorizontal: 18 },
  confirmModal: { width: "100%", maxWidth: 360, height: 360, backgroundColor: colors.white, borderRadius: 24, padding: 16, position: "relative", shadowColor: "#071B2A", shadowOpacity: 0.25, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, elevation: 12 },
  confirmModalContent: { width: "100%" },
  confirmModalIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: "#E7F4F2", alignItems: "center", justifyContent: "center", marginBottom: 11 },
  confirmModalTitle: { color: colors.ink, fontSize: 20, lineHeight: 24, fontWeight: "900", marginBottom: 4 },
  confirmModalSubtitle: { color: colors.muted, fontSize: 13, lineHeight: 18, marginBottom: 11 },
  confirmModalPreview: { backgroundColor: "#F1F7F7", borderRadius: 15, paddingHorizontal: 13, paddingVertical: 11, marginBottom: 14, borderWidth: 1, borderColor: "#E2EEEE" },
  confirmModalPreviewTitle: { color: colors.ink, fontSize: 16, fontWeight: "900", marginBottom: 3 },
  confirmModalPreviewSubtitle: { color: colors.teal, fontSize: 13, fontWeight: "700", marginBottom: 4 },
  confirmModalPreviewBody: { color: colors.ink, fontSize: 14, lineHeight: 19 },
  confirmModalActions: { position: "absolute", left: 16, right: 16, bottom: 16 },
  confirmModalSendFrame: { width: "100%", height: 48, borderRadius: 14, backgroundColor: colors.teal, overflow: "hidden", shadowColor: colors.teal, shadowOpacity: 0.24, shadowRadius: 7, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  confirmModalCancel: { width: "100%", height: 48, marginTop: 8, borderRadius: 14, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", shadowColor: colors.teal, shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  confirmModalCancelText: { color: colors.white, fontSize: 15, fontWeight: "900" },
  confirmModalSend: { width: "100%", height: 48, borderRadius: 14, backgroundColor: "transparent", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 7 },
  confirmModalSendText: { color: colors.white, fontSize: 15, fontWeight: "900" },

  successToast: { flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: colors.navy, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: "#2F566C", shadowColor: "#102F49", shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  successToastIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.green, alignItems: "center", justifyContent: "center" },
  errorToast: { backgroundColor: "#7F2630", borderColor: "#A9434D" },
  errorToastIcon: { backgroundColor: "#D4515C" },
  successToastTitle: { color: colors.white, fontSize: 14, fontWeight: "900" },
  successToastBody: { color: "#C6D7E1", fontSize: 12, lineHeight: 16, marginTop: 2 },
  header: { flexDirection: "row", alignItems: "center", paddingTop: 8, gap: 12 },
  headerLogo: { width: 64, height: 64, borderRadius: 20 },
  headerCopy: { flex: 1 },
  eyebrow: { color: colors.teal, letterSpacing: 2.4, fontSize: 9, fontWeight: "800" },
  heading: { color: colors.ink, fontSize: 23, lineHeight: 27, fontWeight: "900" },
  statusDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.green },
  hero: { backgroundColor: colors.navy, borderRadius: 34, padding: 28, gap: 12 },
  heroRow: { flexDirection: "row", alignItems: "center", gap: 18 },
  heroIcon: { width: 68, height: 68, borderRadius: 22, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  heroEyebrow: { color: "#B5E2E0", letterSpacing: 2.8, fontSize: 11, fontWeight: "800" },
  heroTitle: { color: colors.white, fontSize: 24, lineHeight: 30, fontWeight: "900" },
  heroBody: { color: "#C6D7E1", fontSize: 15, lineHeight: 22 },
  readyCard: { backgroundColor: colors.white, borderRadius: 26, borderWidth: 1, borderColor: colors.border, padding: 20, flexDirection: "row", gap: 15, alignItems: "center" },
  readyIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: "#EEF8F5", alignItems: "center", justifyContent: "center" },
  flexCopy: { flex: 1 },
  cardTitle: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  cardBody: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 4 },
  sectionHeadingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { color: colors.ink, fontSize: 21, lineHeight: 25, fontWeight: "900" },
  sectionLabel: { color: colors.muted, fontSize: 9, letterSpacing: 1.8, fontWeight: "800" },
  formCard: { backgroundColor: colors.white, borderRadius: 25, paddingHorizontal: 20, borderWidth: 1, borderColor: colors.border },
  field: { paddingVertical: 17, borderBottomWidth: 1, borderBottomColor: colors.border },
  fieldHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  fieldLabel: { color: colors.ink, fontSize: 15, fontWeight: "800" },
  counter: { color: colors.muted, fontSize: 13 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 18, minHeight: 58, paddingHorizontal: 17, color: colors.ink, fontSize: 16, backgroundColor: "#FCFCFC" },
  textArea: { minHeight: 110, paddingTop: 15 },
  optionCard: { backgroundColor: colors.white, borderRadius: 25, borderWidth: 1, borderColor: colors.border, padding: 20, flexDirection: "row", gap: 15, alignItems: "center" },
  optionIcon: { width: 60, height: 60, borderRadius: 19, backgroundColor: "#EEF8F5", alignItems: "center", justifyContent: "center" },
  modelsHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bookmarkAction: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#EEF8F5", paddingTop: 2 },
  modelsCard: { backgroundColor: colors.white, borderRadius: 25, padding: 20, borderWidth: 1, borderColor: colors.border, gap: 14, shadowColor: "#B8C8CF", shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  presetsHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  presetsCard: { backgroundColor: colors.white, borderRadius: 25, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 13, shadowColor: "#B8C8CF", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2, overflow: "visible" },
  presetActionPanel: { backgroundColor: "#F4FAFA", borderRadius: 22, padding: 14, marginTop: -4, borderWidth: 1, borderColor: colors.border },
  presetHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  presetIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  presetIconSent: { backgroundColor: colors.navy },
  presetTitle: { color: colors.ink, fontSize: 17, fontWeight: "900" },
  presetDescription: { color: colors.muted, fontSize: 13, marginTop: 3 },
  presetInputsRow: { flexDirection: "row", gap: 8 },
  presetInput: { flex: 1, minWidth: 0, height: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 12, color: colors.ink, fontSize: 13, backgroundColor: "#FCFCFC" },
  presetValueInput: { width: 94, height: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 10, color: colors.ink, fontSize: 13, backgroundColor: "#FCFCFC" },

  applyPresetButton: { width: "100%", height: 48, borderRadius: 14, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  directPresetButton: { width: "100%", height: 54, marginBottom: 10, borderRadius: 15, backgroundColor: "#E87808", borderWidth: 1, borderColor: "#D76600", alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  directPresetText: { color: colors.white, fontSize: 15, fontWeight: "900" },
  applyPresetText: { color: colors.white, fontSize: 14, fontWeight: "900" },
  modelRow: { flexDirection: "row", gap: 10, alignItems: "center", width: "100%" },
  modelInput: { flex: 1, flexShrink: 1, minWidth: 0, height: 58, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingHorizontal: 14, color: colors.ink, fontSize: 14, backgroundColor: "#FCFCFC" },
  saveButton: { width: 104, flexShrink: 0, height: 58, paddingHorizontal: 8, borderRadius: 18, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 5 },
  saveReady: { backgroundColor: colors.teal },
  saveDisabled: { backgroundColor: "#A9D2CF" },
  saveText: { color: colors.white, fontSize: 14, fontWeight: "900" },
  modelHint: { color: colors.muted, fontSize: 13 },
  saveMessage: { color: colors.teal, fontSize: 14, fontWeight: "800" },
  savedModelsCard: { backgroundColor: colors.white, borderRadius: 25, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 12 },
  savedModelsHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  savedModelsTitle: { color: colors.ink, fontSize: 17, fontWeight: "900" },
  savedModelsCount: { color: colors.teal, fontSize: 16, fontWeight: "900" },
  savedModelRow: { flexDirection: "row", alignItems: "center", gap: 8, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  savedModelName: { color: colors.ink, fontSize: 16, fontWeight: "800" },
  savedModelBody: { color: colors.muted, fontSize: 14, marginTop: 3 },
  smallAction: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#EEF8F5", alignItems: "center", justifyContent: "center" },
  confirmCard: { backgroundColor: "#FFF7F2", borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "#F0CDBD", gap: 8 },
  confirmTitle: { color: colors.ink, fontSize: 17, fontWeight: "900" },
  confirmBody: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  confirmActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 5 },
  confirmButton: { minHeight: 40, borderRadius: 12, paddingHorizontal: 16, alignItems: "center", justifyContent: "center" },
  cancelButton: { backgroundColor: "#E8EFF2" },
  deleteButton: { backgroundColor: "#B64B4B" },
  cancelText: { color: colors.ink, fontSize: 14, fontWeight: "800" },
  deleteText: { color: colors.white, fontSize: 14, fontWeight: "800" },
  previewHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  nowLabel: { color: colors.muted, letterSpacing: 2, fontSize: 11, fontWeight: "800" },
  greenDot: { color: colors.green, fontSize: 16 },
  previewOuter: { backgroundColor: colors.navy, borderRadius: 28, padding: 12 },
  preview: { borderWidth: 1, borderColor: "#506A7A", borderRadius: 23, padding: 17, flexDirection: "row", gap: 13 },
  previewIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  previewTop: { flexDirection: "row", justifyContent: "space-between", gap: 5 },
  previewTitle: { color: colors.white, fontSize: 16, fontWeight: "800", flex: 1 },
  previewTime: { color: "#C6D7E1", fontSize: 13 },
  previewSubtitle: { color: "#D8E4EA", fontSize: 14, lineHeight: 19, marginTop: 4 },
  previewBody: { color: "#D8E4EA", fontSize: 14, lineHeight: 19, marginTop: 3 },
  buttonShell: { minHeight: 64, borderRadius: 22, overflow: "hidden" },
  primaryButton: { minHeight: 64, borderRadius: 22, borderWidth: 1.5, borderColor: "transparent", alignItems: "center", justifyContent: "center", position: "relative", width: "100%" },
  primaryButtonReady: { backgroundColor: "#168F86", borderColor: "#0E8278", shadowColor: "#0E8278", shadowOpacity: 0.28, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  primaryButtonDisabled: { backgroundColor: "#168F86", borderColor: "#0E8278", shadowColor: "#0E8278", shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3, opacity: 1 },
  primaryIconSlot: { position: "absolute", left: 16, width: 40, alignItems: "center", justifyContent: "center" },
  primaryText: { position: "absolute", left: 0, right: 0, color: colors.white, fontSize: 14, lineHeight: 20, fontWeight: "900", textAlign: "center" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  emittingButton: { opacity: 0.72 },
});

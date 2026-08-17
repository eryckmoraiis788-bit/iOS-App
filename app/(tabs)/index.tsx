import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useNotificationStore } from "@/lib/notification-store";

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
  const [isEmitting, setIsEmitting] = useState(false);
  const { selectedImage, emit } = useNotificationStore();
  const canEmit = title.trim().length > 0 && body.trim().length > 0;

  const handleEmit = async () => {
    if (isEmitting) return;
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle || !trimmedBody) {
      Alert.alert("Preencha a notificação", "Informe o nome exibido e a mensagem antes de emitir.");
      return;
    }
    setIsEmitting(true);
    try {
      const emitted = await emit({ title: trimmedTitle, subtitle: subtitle.trim(), body: trimmedBody, imageUri: selectedImage });
      if (emitted) Alert.alert("Notificação emitida", "A notificação foi enviada para o iPhone.");
    } catch (error) {
      const detail = error instanceof Error && error.message ? error.message : "O iOS recusou o agendamento da notificação.";
      Alert.alert("Não foi possível emitir", detail);
    } finally {
      setIsEmitting(false);
    }
  };

  return (
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
        <MaterialIcons name="bookmark-border" size={31} color={colors.teal} />
      </View>

      <View style={styles.modelsCard}>
        <View style={styles.modelRow}>
          <TextInput placeholder="Nome do modelo (opcional)" placeholderTextColor="#87949C" style={styles.modelInput} editable={false} />
          <View style={styles.saveButton}>
            <MaterialIcons name="bookmark" size={23} color={colors.white} />
            <Text style={styles.saveText}>Salvar</Text>
          </View>
        </View>
        <Text style={styles.modelHint}>Seus modelos salvos aparecerão aqui.</Text>
      </View>

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

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Emitir notificação"
        accessibilityState={{ disabled: !canEmit || isEmitting }}
        onPress={handleEmit}
        style={({ pressed }) => [
          styles.primaryButton,
          canEmit ? styles.primaryButtonReady : styles.primaryButtonDisabled,
          pressed && canEmit && styles.pressed,
          isEmitting && styles.emittingButton,
        ]}
      >
        <MaterialIcons name={isEmitting ? "hourglass-empty" : "notifications-none"} size={28} color={colors.white} />
        <Text style={styles.primaryText}>{isEmitting ? "Emitindo…" : "Emitir notificação"}</Text>
      </Pressable>
    </ScrollView>
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
  header: { flexDirection: "row", alignItems: "center", paddingTop: 8, gap: 14 },
  headerLogo: { width: 80, height: 80, borderRadius: 24 },
  headerCopy: { flex: 1 },
  eyebrow: { color: colors.teal, letterSpacing: 3, fontSize: 13, fontWeight: "800" },
  heading: { color: colors.ink, fontSize: 32, lineHeight: 38, fontWeight: "900" },
  statusDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.green },
  hero: { backgroundColor: colors.navy, borderRadius: 34, padding: 28, gap: 12 },
  heroRow: { flexDirection: "row", alignItems: "center", gap: 18 },
  heroIcon: { width: 68, height: 68, borderRadius: 22, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  heroEyebrow: { color: "#B5E2E0", letterSpacing: 3, fontSize: 13, fontWeight: "800" },
  heroTitle: { color: colors.white, fontSize: 28, lineHeight: 35, fontWeight: "900" },
  heroBody: { color: "#C6D7E1", fontSize: 18, lineHeight: 27 },
  readyCard: { backgroundColor: colors.white, borderRadius: 26, borderWidth: 1, borderColor: colors.border, padding: 20, flexDirection: "row", gap: 15, alignItems: "center" },
  readyIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: "#EEF8F5", alignItems: "center", justifyContent: "center" },
  flexCopy: { flex: 1 },
  cardTitle: { color: colors.ink, fontSize: 18, fontWeight: "800" },
  cardBody: { color: colors.muted, fontSize: 16, lineHeight: 22, marginTop: 4 },
  sectionHeadingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { color: colors.ink, fontSize: 25, fontWeight: "900" },
  sectionLabel: { color: colors.muted, fontSize: 11, letterSpacing: 2, fontWeight: "800" },
  formCard: { backgroundColor: colors.white, borderRadius: 25, paddingHorizontal: 20, borderWidth: 1, borderColor: colors.border },
  field: { paddingVertical: 17, borderBottomWidth: 1, borderBottomColor: colors.border },
  fieldHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  fieldLabel: { color: colors.ink, fontSize: 17, fontWeight: "800" },
  counter: { color: colors.muted, fontSize: 15 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 18, minHeight: 58, paddingHorizontal: 17, color: colors.ink, fontSize: 18, backgroundColor: "#FCFCFC" },
  textArea: { minHeight: 110, paddingTop: 15 },
  optionCard: { backgroundColor: colors.white, borderRadius: 25, borderWidth: 1, borderColor: colors.border, padding: 20, flexDirection: "row", gap: 15, alignItems: "center" },
  optionIcon: { width: 60, height: 60, borderRadius: 19, backgroundColor: "#EEF8F5", alignItems: "center", justifyContent: "center" },
  modelsHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modelsCard: { backgroundColor: colors.white, borderRadius: 25, padding: 20, borderWidth: 1, borderColor: colors.border, gap: 14 },
  modelRow: { flexDirection: "row", gap: 14, alignItems: "center" },
  modelInput: { flex: 1, height: 58, borderWidth: 1, borderColor: colors.border, borderRadius: 18, paddingHorizontal: 16, color: colors.muted, fontSize: 17, backgroundColor: "#FCFCFC" },
  saveButton: { height: 58, paddingHorizontal: 19, borderRadius: 18, backgroundColor: "#A9D2CF", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 7 },
  saveText: { color: colors.white, fontSize: 17, fontWeight: "900" },
  modelHint: { color: colors.muted, fontSize: 15 },
  previewHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  nowLabel: { color: colors.muted, letterSpacing: 2, fontSize: 11, fontWeight: "800" },
  greenDot: { color: colors.green, fontSize: 16 },
  previewOuter: { backgroundColor: colors.navy, borderRadius: 28, padding: 12 },
  preview: { borderWidth: 1, borderColor: "#506A7A", borderRadius: 23, padding: 17, flexDirection: "row", gap: 13 },
  previewIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  previewTop: { flexDirection: "row", justifyContent: "space-between", gap: 5 },
  previewTitle: { color: colors.white, fontSize: 18, fontWeight: "800", flex: 1 },
  previewTime: { color: "#C6D7E1", fontSize: 13 },
  previewSubtitle: { color: "#D8E4EA", fontSize: 16, lineHeight: 21, marginTop: 4 },
  previewBody: { color: "#D8E4EA", fontSize: 15, lineHeight: 20, marginTop: 3 },
  primaryButton: { minHeight: 64, borderRadius: 22, borderWidth: 1.5, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10 },
  primaryButtonReady: { backgroundColor: "#168F86", borderColor: "#0E8278", shadowColor: "#0E8278", shadowOpacity: 0.28, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  primaryButtonDisabled: { backgroundColor: "#A9D2CF", borderColor: "#A9D2CF", shadowOpacity: 0, elevation: 0 },
  primaryText: { color: colors.white, fontSize: 19, fontWeight: "900" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  emittingButton: { opacity: 0.72 },
});

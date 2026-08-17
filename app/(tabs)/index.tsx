import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const colors = {
  bg: "#EAF4F8",
  ink: "#121B24",
  muted: "#667580",
  teal: "#0E8278",
  navy: "#102F49",
  white: "#FFFFFF",
  border: "#D4E0E5",
};

export default function ComposeScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.screen}
      showsVerticalScrollIndicator
      alwaysBounceVertical
      bounces
      nestedScrollEnabled
      contentInsetAdjustmentBehavior="never"
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>COMPOSITOR</Text>
          <Text style={styles.heading}>Criar notificação</Text>
        </View>
        <View style={styles.dot} />
      </View>

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Text style={styles.heroIconText}>•</Text>
        </View>
        <Text style={styles.heroEyebrow}>PRONTA PARA CHEGAR</Text>
        <Text style={styles.heroTitle}>Uma mensagem, no momento certo.</Text>
        <Text style={styles.heroBody}>
          Escreva uma notificação clara e veja como ela ficará antes de emitir.
        </Text>
      </View>

      <View style={styles.readyCard}>
        <View style={styles.readyIcon}>
          <Text style={styles.readyIconText}>✓</Text>
        </View>
        <View style={styles.cardCopy}>
          <Text style={styles.cardTitle}>Notificações prontas</Text>
          <Text style={styles.cardBody}>
            Você pode emitir uma notificação a qualquer momento.
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>

      <Text style={styles.sectionTitle}>
        Pré-visualização <Text style={styles.sectionLabel}> AGORA</Text>
      </Text>

      <View style={styles.previewOuter}>
        <View style={styles.preview}>
          <View style={styles.previewIcon}>
            <Text style={styles.previewIconText}>•</Text>
          </View>
          <View style={styles.cardCopy}>
            <View style={styles.previewTop}>
              <Text style={styles.previewTitle}>Nome exibido</Text>
              <Text style={styles.previewTime}>agora</Text>
            </View>
            <Text style={styles.previewSubtitle}>O assunto aparecerá aqui antes do envio.</Text>
            <Text style={styles.previewBody}>A mensagem da notificação aparecerá aqui.</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryText}>Emitir notificação</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  screen: { flexGrow: 1, backgroundColor: colors.bg, padding: 20, paddingBottom: 170, gap: 18 },
  header: { flexDirection: "row", alignItems: "center", paddingTop: 8 },
  eyebrow: { color: colors.teal, letterSpacing: 3, fontSize: 12, fontWeight: "800" },
  heading: { color: colors.ink, fontSize: 32, lineHeight: 38, fontWeight: "900" },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#3CA77A", marginLeft: "auto" },
  hero: { backgroundColor: colors.navy, borderRadius: 34, padding: 24, gap: 10 },
  heroIcon: { width: 58, height: 58, borderRadius: 19, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  heroIconText: { color: colors.white, fontSize: 35, lineHeight: 35, fontWeight: "900" },
  heroEyebrow: { color: "#B5E2E0", letterSpacing: 3, fontSize: 12, fontWeight: "800" },
  heroTitle: { color: colors.white, fontSize: 26, lineHeight: 33, fontWeight: "900" },
  heroBody: { color: "#C6D7E1", fontSize: 17, lineHeight: 25 },
  readyCard: { backgroundColor: colors.white, borderRadius: 26, borderWidth: 1, borderColor: colors.border, padding: 18, flexDirection: "row", gap: 14, alignItems: "center" },
  readyIcon: { width: 50, height: 50, borderRadius: 17, backgroundColor: "#EEF8F5", alignItems: "center", justifyContent: "center" },
  readyIconText: { color: colors.teal, fontSize: 28, fontWeight: "800" },
  cardCopy: { flex: 1 },
  cardTitle: { color: colors.ink, fontSize: 18, fontWeight: "800" },
  cardBody: { color: colors.muted, fontSize: 15, lineHeight: 21, marginTop: 4 },
  chevron: { color: colors.muted, fontSize: 30 },
  sectionTitle: { color: colors.ink, fontSize: 24, fontWeight: "900" },
  sectionLabel: { color: colors.muted, fontSize: 11, letterSpacing: 2 },
  previewOuter: { backgroundColor: colors.navy, borderRadius: 28, padding: 12 },
  preview: { borderWidth: 1, borderColor: "#506A7A", borderRadius: 23, padding: 15, flexDirection: "row", gap: 12 },
  previewIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  previewIconText: { color: colors.white, fontSize: 28, fontWeight: "900" },
  previewTop: { flexDirection: "row", justifyContent: "space-between", gap: 5 },
  previewTitle: { color: colors.white, fontSize: 17, fontWeight: "800", flex: 1 },
  previewTime: { color: "#C6D7E1", fontSize: 13 },
  previewSubtitle: { color: "#D8E4EA", fontSize: 15, lineHeight: 20, marginTop: 4 },
  previewBody: { color: "#D8E4EA", fontSize: 14, lineHeight: 19, marginTop: 3 },
  primaryButton: { minHeight: 60, borderRadius: 22, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" },
  primaryText: { color: colors.white, fontSize: 18, fontWeight: "900" },
});

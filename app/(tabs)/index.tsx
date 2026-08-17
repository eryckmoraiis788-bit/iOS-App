import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function ComposeScreen() {
  return (
    <ScreenContainer containerClassName="bg-[#EAF4F8]" edges={["top", "left", "right"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>COMPOSITOR</Text>
          <Text style={styles.heading}>Criar notificação</Text>
        </View>
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>PRONTA PARA CHEGAR</Text>
          <Text style={styles.heroTitle}>Uma mensagem, no momento certo.</Text>
          <Text style={styles.heroBody}>Escreva uma notificação clara e veja como ela ficará antes de emitir.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Conteúdo</Text>
          <TextInput placeholder="Nome exibido" style={styles.input} />
          <TextInput placeholder="Subtítulo (Opcional)" style={styles.input} />
          <TextInput placeholder="Mensagem" multiline style={[styles.input, styles.textArea]} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pré-visualização</Text>
          <Text style={styles.body}>A mensagem da notificação aparecerá aqui.</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 180, gap: 18 },
  header: { paddingTop: 8 },
  eyebrow: { color: "#0E8278", letterSpacing: 3, fontSize: 12, fontWeight: "800" },
  heading: { color: "#121B24", fontSize: 32, lineHeight: 38, fontWeight: "900" },
  hero: { backgroundColor: "#102F49", borderRadius: 28, padding: 24, gap: 10 },
  heroEyebrow: { color: "#B5E2E0", letterSpacing: 3, fontSize: 12, fontWeight: "800" },
  heroTitle: { color: "#FFFFFF", fontSize: 26, lineHeight: 33, fontWeight: "900" },
  heroBody: { color: "#C6D7E1", fontSize: 17, lineHeight: 25 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 24, padding: 20, borderWidth: 1, borderColor: "#D4E0E5", gap: 14 },
  cardTitle: { color: "#121B24", fontSize: 22, fontWeight: "900" },
  input: { borderWidth: 1, borderColor: "#D4E0E5", borderRadius: 16, minHeight: 54, paddingHorizontal: 16, color: "#121B24", fontSize: 17 },
  textArea: { minHeight: 100, paddingTop: 14, textAlignVertical: "top" },
  body: { color: "#667580", fontSize: 16, lineHeight: 22 },
});

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = { children: ReactNode };
type State = { error: Error | null; info: ErrorInfo | null };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): State {
    return { error, info: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Inter] Erro de renderização capturado", error, info.componentStack);
    this.setState({ error, info });
  }

  private retry = () => {
    this.setState({ error: null, info: null });
  };

  render() {
    const { error, info } = this.state;
    if (!error) return this.props.children;

    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>INTER • DIAGNÓSTICO</Text>
          <Text style={styles.title}>Não foi possível carregar esta tela</Text>
          <Text style={styles.body}>
            O erro foi capturado para evitar uma tela branca. Toque em tentar novamente ou envie esta mensagem para análise.
          </Text>
          <Text selectable style={styles.error}>
            {error.name}: {error.message}
          </Text>
          {info?.componentStack ? (
            <Text selectable style={styles.stack} numberOfLines={8}>
              {info.componentStack}
            </Text>
          ) : null}
          <Pressable onPress={this.retry} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EAF4F8", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { width: "100%", maxWidth: 520, backgroundColor: "#FFF", borderRadius: 24, borderWidth: 1, borderColor: "#D4E0E5", padding: 22, gap: 12 },
  eyebrow: { color: "#0E8278", fontSize: 11, fontWeight: "800", letterSpacing: 2 },
  title: { color: "#121B24", fontSize: 22, fontWeight: "900" },
  body: { color: "#667580", fontSize: 15, lineHeight: 22 },
  error: { color: "#B44B47", backgroundColor: "#FFF4F2", borderRadius: 10, padding: 10, fontSize: 12 },
  stack: { color: "#667580", fontSize: 10, lineHeight: 14, maxHeight: 120 },
  button: { backgroundColor: "#0E8278", borderRadius: 13, paddingVertical: 13, alignItems: "center" },
  pressed: { opacity: 0.78 },
  buttonText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
});

import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useNotificationStore } from "@/lib/notification-store";
import type { NotificationReceipt } from "@/lib/receipt-storage";
import { formatReceiptPersonName, formatReceiptTime } from "@/lib/receipt-utils";

const colors = {
  background: "#FFFFFF",
  ink: "#191919",
  muted: "#737373",
  orange: "#EA7100",
  success: "#00A651",
  line: "#ECECEC",
  menu: "#FFFFFF",
};

const institutionOptions = [
  "NU PAGAMENTOS - IP",
  "ITAÚ UNIBANCO S.A.",
  "PICPAY",
  "CAIXA ECONOMICA FEDERAL",
  "BANCO INTER",
  "MERCADO PAGO IP LTDA.",
  "BCO DO BRASIL S.A.",
  "PAGSEGURO INTERNET IP S.A.",
] as const;

const receiptCategories = [
  "Sem categoria",
  "Alimentação",
  "Compras",
  "Contas",
  "Casa",
  "Educação",
  "Lazer",
  "Saúde",
  "Transporte",
  "Outros",
] as const;

const payer = {
  name: "ERYCK DARLISSON DOS SANTOS MORAIS",
  document: "***.484.813-**",
  institution: "BANCO INTER",
};

type EditableReceiptFields = Partial<Pick<NotificationReceipt, "amount" | "recipientName" | "document" | "institution" | "category" | "description">>;

export default function ReceiptDetailScreen() {
  const router = useRouter();
  const { recordId } = useLocalSearchParams<{ recordId?: string }>();
  const { records, receipts, updateReceipt } = useNotificationStore();
  const record = records.find((item) => item.id === recordId);
  const receipt = receipts.find((item) => item.recordId === recordId);
  const [isSaving, setIsSaving] = useState(false);
  const [institutionPickerOpen, setInstitutionPickerOpen] = useState(false);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");

  if (!record || !receipt) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-white" safeAreaClassName="bg-white" containerStyle={styles.screen}>
        <View style={styles.notFound}>
          <MaterialIcons name="receipt-long" size={42} color={colors.orange} />
          <Text style={styles.notFoundTitle}>{record ? "Comprovante sendo preparado" : "Comprovante não encontrado"}</Text>
          <Pressable onPress={() => router.replace("/")} style={styles.backFallback} accessibilityRole="button">
            <Text style={styles.backFallbackText}>Voltar para Compor</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  // Notification titles can be localized or include a short sender suffix.
  // Keep the received-Pix detail screen selected for all such variants.
  const normalizedRecordTitle = record.title.trim().toLocaleLowerCase("pt-BR");
  const isReceivedPix = normalizedRecordTitle.includes("pix recebido");
  const receiptTimestamp = receipt.eventAt;
  const recipientName = formatReceiptPersonName(receipt.recipientName);
  const receivedSenderName = formatReceiptPersonName(record.senderName?.trim() || receipt.recipientName);
  const receivedSenderDocument = record.senderDocument?.trim() || receipt.document;
  const payerName = record.senderName?.trim() || payer.name;
  const payerDocument = record.senderDocument?.trim() || payer.document;
  const categoryLabel = receipt.category?.trim() || "Sem categoria";
  const description = receipt.description?.trim() || "";

  const persistReceiptChange = async (input: EditableReceiptFields) => {
    if (isSaving) return false;
    setIsSaving(true);
    try {
      await updateReceipt(receipt.id, input);
      return true;
    } catch (error) {
      Alert.alert("Não foi possível salvar", error instanceof Error ? error.message : "Tente novamente.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const toggleInstitutionPicker = () => setInstitutionPickerOpen((current) => !current);
  const selectInstitution = async (institution: string) => {
    if (isSaving || institution === receipt.institution) {
      setInstitutionPickerOpen(false);
      return;
    }
    if (await persistReceiptChange({ institution })) setInstitutionPickerOpen(false);
  };
  const randomInstitution = async () => {
    if (isSaving) return;
    const available = institutionOptions.filter((institution) => institution !== receipt.institution);
    const nextInstitution = available[Math.floor(Math.random() * available.length)] ?? institutionOptions[0];
    await selectInstitution(nextInstitution);
  };
  const chooseCategory = async (category: string) => {
    if (await persistReceiptChange({ category: category === "Sem categoria" ? "" : category })) setCategoryPickerOpen(false);
  };
  const beginDescriptionEdit = () => {
    setDescriptionDraft(receipt.description ?? "");
    setIsEditingDescription(true);
  };
  const saveDescription = async () => {
    const nextDescription = descriptionDraft.trim().slice(0, 160);
    if (await persistReceiptChange({ description: nextDescription })) {
      setDescriptionDraft(nextDescription);
      setIsEditingDescription(false);
    }
  };
  const handleCopyTransactionId = async () => {
    try {
      await Clipboard.setStringAsync(receipt.transactionId);
      Alert.alert("ID copiado", "O ID da transação foi copiado para a área de transferência.");
    } catch (error) {
      console.error("[receipt] failed to copy transaction ID", error);
      Alert.alert("Não foi possível copiar", "Tente copiar o ID novamente.");
    }
  };
  const showReceivedHelp = () => {
    Alert.alert("Pix recebido", "Confira os dados do remetente, o valor e o identificador desta notificação.");
  };
  const showReturnPixDemo = () => {
    Alert.alert("Devolver Pix", "Esta é apenas uma demonstração da interface. Nenhuma devolução será iniciada e nenhum dinheiro será movimentado.", [{ text: "Entendi" }]);
  };
  const handleShare = async () => {
    const kind = isReceivedPix ? "Pix recebido" : "Pix enviado";
    const message = [
      `Comprovante de ${kind}`,
      `Valor: R$ ${receipt.amount}`,
      `ID da transação: ${receipt.transactionId}`,
      `Destinatário: ${recipientName}`,
    ].join("\n");

    try {
      await Share.share({ message, title: "Comprovante Pix" });
    } catch (error) {
      console.error("[receipt] failed to share receipt", error);
    }
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-white" safeAreaClassName="bg-white" containerStyle={styles.screen}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Voltar">
            <MaterialIcons name="arrow-back" size={25} color={colors.orange} />
          </Pressable>
          <Text style={styles.headerTitle}>{isReceivedPix ? "Pix recebido" : "Comprovante"}</Text>
          <Pressable
            onPress={isReceivedPix ? showReceivedHelp : () => router.replace("/")}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={isReceivedPix ? "Ajuda sobre Pix recebido" : "Início"}
          >
            {isReceivedPix
              ? <MaterialCommunityIcons name="help-circle-outline" size={26} color={colors.orange} />
              : <MaterialCommunityIcons name="home-outline" size={26} color={colors.orange} />}
          </Pressable>
        </View>

        <ScrollView
          style={styles.receiptScroll}
          contentContainerStyle={isReceivedPix ? styles.receivedBody : styles.receiptBody}
          showsVerticalScrollIndicator={!isReceivedPix}
          keyboardShouldPersistTaps="handled"
        >
          {isReceivedPix ? (
            <>
              <View style={styles.receivedHero}>
                <View style={styles.receivedDirectionCircle}>
                  <MaterialCommunityIcons name="arrow-down" size={27} color={colors.ink} />
                </View>
                <Text style={styles.receivedAmount}>R$ {receipt.amount}</Text>
                <Text style={styles.receivedName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.76}>{receivedSenderName}</Text>
                <View style={styles.receivedCategoryFrame}>
                  <Text style={styles.receivedCategoryText} numberOfLines={1}>{categoryLabel}</Text>
                  <View style={styles.receivedPencilCircle}>
                    <MaterialCommunityIcons name="pencil-outline" size={18} color="#FFFFFF" />
                  </View>
                  <Pressable
                    onPress={() => setCategoryPickerOpen((current) => !current)}
                    accessibilityRole="button"
                    accessibilityLabel={`Categoria: ${categoryLabel}. Toque para alterar`}
                    style={({ pressed }) => [StyleSheet.absoluteFillObject, pressed && styles.receivedCategoryPressed]}
                  />
                </View>
                {categoryPickerOpen && (
                  <View style={styles.receivedCategoryOptions} accessibilityRole="menu">
                    {receiptCategories.map((category) => (
                      <Pressable
                        key={category}
                        onPress={() => void chooseCategory(category)}
                        style={({ pressed }) => [styles.receivedCategoryOption, pressed && styles.rowPressed]}
                        accessibilityRole="menuitem"
                        accessibilityState={{ selected: category === categoryLabel }}
                      >
                        <Text style={[styles.receivedCategoryOptionText, category === categoryLabel && styles.receivedCategoryOptionSelected]}>{category}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.receivedTransactionSection}>
                <Text style={styles.receivedSectionTitle}>Sobre a transação</Text>
                <ReceivedInfoRow label="Data da transação" value={formatReceiptDateReference(receiptTimestamp)} />
                <ReceivedInfoRow label="Horário" value={formatReceiptTime(receiptTimestamp)} />
                <View style={styles.receivedTransactionId}>
                  <Text style={styles.receivedInfoLabel}>ID da transação</Text>
                  <View style={styles.receivedTransactionIdLine}>
                    <Text style={styles.receivedInfoValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>{receipt.transactionId}</Text>
                    <Pressable
                      onPress={() => void handleCopyTransactionId()}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel="Copiar ID da transação"
                      style={styles.receivedCopyButton}
                    >
                      <MaterialCommunityIcons name="content-copy" size={22} color={colors.orange} />
                    </Pressable>
                  </View>
                </View>

                {isEditingDescription ? (
                  <View style={styles.receivedDescriptionEditor}>
                    <TextInput
                      value={descriptionDraft}
                      onChangeText={setDescriptionDraft}
                      placeholder="Adicionar descrição"
                      placeholderTextColor="#858585"
                      maxLength={160}
                      multiline
                      autoFocus
                      style={styles.receivedDescriptionInput}
                      accessibilityLabel="Descrição da transação"
                    />
                    <View style={styles.receivedDescriptionActions}>
                      <Pressable
                        onPress={() => setIsEditingDescription(false)}
                        accessibilityRole="button"
                        style={styles.receivedDescriptionCancel}
                      >
                        <Text style={styles.receivedDescriptionCancelText}>Cancelar</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => void saveDescription()}
                        disabled={isSaving}
                        accessibilityRole="button"
                        style={[styles.receivedDescriptionSave, isSaving && styles.disabledAction]}
                      >
                        <Text style={styles.receivedDescriptionSaveText}>{isSaving ? "Salvando…" : "Salvar"}</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : description ? (
                  <View style={styles.receivedSavedDescription}>
                    <Text style={styles.receivedDescriptionLabel}>Descrição</Text>
                    <Text style={styles.receivedDescriptionValue}>{description}</Text>
                    <Pressable onPress={beginDescriptionEdit} accessibilityRole="button" accessibilityLabel="Editar descrição">
                      <Text style={styles.receivedDescriptionLink}>Editar descrição</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable onPress={beginDescriptionEdit} accessibilityRole="button" accessibilityLabel="Adicionar descrição">
                    <Text style={styles.receivedDescriptionLink}>Adicionar descrição</Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.receivedDivider} accessibilityElementsHidden />

              <View style={styles.receivedSenderSection}>
                <Text style={styles.receivedSectionTitle}>Quem enviou</Text>
                <ReceivedInfoRow label="Nome" value={receivedSenderName} />
                <ReceivedInfoRow label="CPF/CNPJ" value={receivedSenderDocument} />
                <ReceivedInfoRow label="Instituição" value={receipt.institution.toUpperCase()} />
              </View>

              <View style={styles.receivedDivider} accessibilityElementsHidden />
              <View style={styles.receivedReturnFrame}>
                <Text style={styles.receivedReturnText}>Devolver Pix</Text>
                <MaterialCommunityIcons name="chevron-right" size={25} color={colors.orange} />
                <Pressable
                  onPress={showReturnPixDemo}
                  accessibilityRole="button"
                  accessibilityLabel="Devolver Pix — demonstração, sem transação real"
                  style={({ pressed }) => [StyleSheet.absoluteFillObject, pressed && styles.receivedReturnPressed]}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.successCircle}>
                <MaterialIcons name="check" size={37} color="#FFFFFF" />
              </View>
              <Text style={styles.receiptTitle}>Pix enviado</Text>
              <Text style={styles.amount}>R$ {receipt.amount}</Text>

              <View style={[styles.section, styles.firstSection]}>
                <Text style={styles.sectionTitle}>Sobre a transação</Text>
                <InfoRow label="Data do pagamento" value={formatReceiptDateReference(receiptTimestamp)} />
                <InfoRow label="Horário" value={formatReceiptTime(receiptTimestamp)} />
                <LongInfo label="ID da transação" value={receipt.transactionId} />
              </View>

              <View style={styles.separator} accessibilityElementsHidden />

              <View style={[styles.section, styles.recipientSection]}>
                <Text style={styles.sectionTitle}>Quem recebeu</Text>
                <InfoRow label="Nome" value={recipientName} />
                <InfoRow label="CPF/CNPJ" value={receipt.document} />
                <InstitutionInfoRow value={receipt.institution} onPress={() => void randomInstitution()} onLongPress={toggleInstitutionPicker} />
                {institutionPickerOpen && (
                  <View style={styles.institutionOptions} accessibilityRole="menu">
                    {institutionOptions.map((institution) => (
                      <Pressable
                        key={institution}
                        onPress={() => void selectInstitution(institution)}
                        style={({ pressed }) => [styles.institutionOption, pressed && styles.rowPressed]}
                        accessibilityRole="menuitem"
                        accessibilityState={{ selected: receipt.institution === institution }}
                        accessibilityLabel={`Selecionar ${institution}`}
                      >
                        <Text style={[styles.institutionOptionText, receipt.institution === institution && styles.institutionOptionSelected]}>{institution}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.separator} accessibilityElementsHidden />
              <View style={[styles.section, styles.payerSection]}>
                <Text style={styles.sectionTitle}>Quem pagou</Text>
                <InfoRow label="Nome" value={payerName} />
                <InfoRow label="CPF/CNPJ" value={payerDocument} />
                <InfoRow label="Instituição" value={payer.institution} />
              </View>
            </>
          )}
        </ScrollView>

        {!isReceivedPix && (
          <View style={styles.footer} accessibilityRole="toolbar">
            <View style={styles.shareButtonFrame}>
              <Text style={styles.shareText}>Compartilhar comprovante</Text>
              <Pressable
                onPress={() => void handleShare()}
                accessibilityRole="button"
                accessibilityLabel="Compartilhar comprovante"
                style={({ pressed }) => [StyleSheet.absoluteFillObject, pressed && styles.sharePressed]}
              />
            </View>
            <View style={styles.newPixButtonFrame}>
              <Text style={styles.newPixText}>Realizar novo Pix</Text>
              <Pressable
                onPress={() => router.replace("/")}
                accessibilityRole="button"
                accessibilityLabel="Realizar novo Pix"
                style={({ pressed }) => [StyleSheet.absoluteFillObject, pressed && styles.newPixPressed]}
              />
            </View>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>{value}</Text>
    </View>
  );
}

function ReceivedInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.receivedInfoRow}>
      <Text style={styles.receivedInfoLabel}>{label}</Text>
      <Text style={styles.receivedInfoValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>{value}</Text>
    </View>
  );
}

function formatReceiptDateReference(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data indisponível";
  const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${weekdays[date.getDay()]}, ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function LongInfo({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.longInfo}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.longValue} selectable>{value}</Text>
    </View>
  );
}

function InstitutionInfoRow({ value, onPress, onLongPress }: { value: string; onPress: () => void; onLongPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={450}
      accessibilityRole="button"
      accessibilityLabel="Trocar instituição aleatoriamente; mantenha pressionado para escolher"
      style={({ pressed }) => [styles.institutionRow, pressed && styles.rowPressed]}
    >
      <Text style={styles.infoLabel}>Instituição</Text>
      <Text style={styles.institutionValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { height: 48, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.background, transform: [{ translateY: -7 }] },
  headerTitle: { color: colors.ink, fontSize: 16.5, lineHeight: 22, fontWeight: "600" },
  receiptScroll: { flex: 1 },
  receiptBody: { paddingHorizontal: 24, paddingTop: 15, paddingBottom: 180 },
  successCircle: { alignSelf: "center", width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", backgroundColor: colors.success, marginBottom: 16 },
  receiptTitle: { color: colors.ink, fontSize: 25, lineHeight: 30, fontWeight: "700", textAlign: "center" },
  amount: { color: colors.ink, fontSize: 25, lineHeight: 30, fontWeight: "700", textAlign: "center", marginTop: 0 },
  section: { marginTop: 56 },
  firstSection: { marginTop: 54 },
  sectionTitle: { color: colors.ink, fontSize: 16, lineHeight: 20, fontWeight: "700", marginBottom: 14 },
  infoRow: { minHeight: 26, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 7 },
  institutionRow: { minHeight: 26, position: "relative", marginBottom: 7 },
  infoLabel: { color: colors.muted, fontSize: 14.5, lineHeight: 20, fontWeight: "400", flexShrink: 0 },
  infoValue: { color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: "700", textAlign: "right", flex: 1, minWidth: 0 },
  institutionValue: { position: "absolute", left: 105, right: 0, top: 0, color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: "700", textAlign: "right" },
  longInfo: { marginBottom: 9 },
  longValue: { color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: "700", marginTop: 1 },
  separator: { height: 1, borderBottomWidth: 1, borderColor: colors.line, borderStyle: "dashed", marginTop: 28 },
  recipientSection: { marginTop: 42 },
  payerSection: { marginTop: 39 },
  institutionOptions: { marginTop: 4, marginBottom: 8, borderRadius: 8, borderWidth: 1, borderColor: "#E0E0E0", backgroundColor: colors.menu, overflow: "hidden" },
  institutionOption: { minHeight: 40, justifyContent: "center", paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  institutionOptionText: { color: colors.ink, fontSize: 14, lineHeight: 18 },
  institutionOptionSelected: { color: colors.orange, fontWeight: "700" },
  rowPressed: { opacity: 0.62 },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, height: 120, zIndex: 20, elevation: 20, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 0, backgroundColor: "#FFFFFF" },
  shareButtonFrame: { position: "relative", alignSelf: "stretch", width: "100%", height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: "#EA7100", marginBottom: 16, overflow: "hidden" },
  shareText: { color: "#FFFFFF", fontSize: 13.75, lineHeight: 20, fontWeight: "700", textAlign: "center" },
  sharePressed: { backgroundColor: "#D06400" },
  newPixButtonFrame: { position: "relative", alignSelf: "stretch", width: "100%", height: 48, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderWidth: 1.5, borderColor: "#FAB573", overflow: "hidden" },
  newPixText: { color: "#EA7100", fontSize: 13.75, lineHeight: 20, fontWeight: "700", textAlign: "center" },
  newPixPressed: { backgroundColor: "rgba(234, 113, 0, 0.08)" },
  receivedBody: { paddingHorizontal: 24, paddingTop: 27, paddingBottom: 32 },
  receivedHero: { alignItems: "center" },
  receivedDirectionCircle: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", backgroundColor: "#F5F6FA", marginBottom: 24 },
  receivedAmount: { color: colors.ink, fontSize: 25, lineHeight: 31, fontWeight: "700", textAlign: "center" },
  receivedName: { color: colors.muted, fontSize: 16.5, lineHeight: 22, fontWeight: "400", textAlign: "center", marginTop: 7, marginBottom: 34, alignSelf: "stretch" },
  receivedCategoryFrame: { position: "relative", minWidth: 134, height: 38, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingLeft: 17, paddingRight: 6, borderRadius: 20, backgroundColor: "#1C1C1E", overflow: "hidden" },
  receivedCategoryText: { color: "#FFFFFF", fontSize: 14, lineHeight: 18, fontWeight: "500", maxWidth: 190 },
  receivedPencilCircle: { width: 27, height: 27, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#66666A" },
  receivedCategoryPressed: { backgroundColor: "rgba(255,255,255,0.10)" },
  receivedCategoryOptions: { alignSelf: "center", width: "80%", marginTop: 8, borderRadius: 10, borderWidth: 1, borderColor: "#E3E3E3", backgroundColor: "#FFFFFF", overflow: "hidden" },
  receivedCategoryOption: { minHeight: 42, justifyContent: "center", paddingHorizontal: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#E8E8E8" },
  receivedCategoryOptionText: { color: colors.ink, fontSize: 14, lineHeight: 18 },
  receivedCategoryOptionSelected: { color: colors.orange, fontWeight: "700" },
  receivedTransactionSection: { marginTop: 51 },
  receivedSectionTitle: { color: colors.ink, fontSize: 17.5, lineHeight: 23, fontWeight: "700", marginBottom: 17 },
  receivedInfoRow: { minHeight: 29, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 13 },
  receivedInfoLabel: { color: "#252525", fontSize: 14, lineHeight: 20, fontWeight: "400", flexShrink: 0 },
  receivedInfoValue: { color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: "700", textAlign: "right", flex: 1, minWidth: 0 },
  receivedTransactionId: { marginTop: 1, marginBottom: 17 },
  receivedTransactionIdLine: { minHeight: 28, flexDirection: "row", alignItems: "center", gap: 8 },
  receivedCopyButton: { width: 30, height: 30, alignItems: "center", justifyContent: "center" },
  receivedDescriptionLink: { color: colors.orange, fontSize: 14, lineHeight: 20, fontWeight: "700", marginTop: 3 },
  receivedDescriptionEditor: { marginTop: 4 },
  receivedDescriptionInput: { minHeight: 72, maxHeight: 120, borderWidth: 1, borderColor: "#D8D8D8", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: colors.ink, fontSize: 14, lineHeight: 20, textAlignVertical: "top" },
  receivedDescriptionActions: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 12, marginTop: 10 },
  receivedDescriptionCancel: { minHeight: 38, justifyContent: "center", paddingHorizontal: 10 },
  receivedDescriptionCancelText: { color: colors.muted, fontSize: 14, fontWeight: "600" },
  receivedDescriptionSave: { minHeight: 38, minWidth: 82, alignItems: "center", justifyContent: "center", paddingHorizontal: 14, borderRadius: 8, backgroundColor: colors.orange },
  receivedDescriptionSaveText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  receivedSavedDescription: { marginTop: 2 },
  receivedDescriptionLabel: { color: colors.muted, fontSize: 13, lineHeight: 18, marginBottom: 2 },
  receivedDescriptionValue: { color: colors.ink, fontSize: 14, lineHeight: 20, fontWeight: "600" },
  disabledAction: { opacity: 0.6 },
  receivedDivider: { height: 8, marginTop: 31, marginHorizontal: -24, backgroundColor: "#F4F5F7" },
  receivedSenderSection: { marginTop: 33 },
  receivedReturnFrame: { position: "relative", height: 74, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#ECECEC", overflow: "hidden" },
  receivedReturnText: { color: colors.ink, fontSize: 14.5, lineHeight: 20, fontWeight: "600" },
  receivedReturnPressed: { backgroundColor: "rgba(234,113,0,0.06)" },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30, gap: 14 },
  notFoundTitle: { color: colors.ink, fontSize: 20, fontWeight: "700", textAlign: "center" },
  backFallback: { paddingHorizontal: 20, paddingVertical: 13, borderRadius: 14, backgroundColor: colors.orange },
  backFallbackText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});

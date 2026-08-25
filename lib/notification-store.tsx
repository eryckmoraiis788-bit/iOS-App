import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as FileSystem from "expo-file-system/legacy";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Alert, Linking, Platform } from "react-native";
import { parseStoredNotificationRecords } from "./notification-storage";
import { getStaleNotificationAttachmentUris, NOTIFICATION_ATTACHMENT_PREFIX } from "./notification-cache";
import { parseStoredNotificationReceipts, type NotificationReceipt } from "./receipt-storage";
import { createMaskedDocument, extractReceiptAmount, extractReceiptRecipientName, getReceiptTimestamp, getReceiptTransactionId } from "./receipt-utils";

export type NotificationTemplate = {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type NotificationRecurrence = "once" | "daily" | "weekly";

export type NotificationRecord = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  imageUri?: string;
  kind: "immediate" | "scheduled";
  status: "sent" | "pending" | "cancelled" | "delivered";
  createdAt: string;
  scheduledAt?: string;
  notificationId?: string;
  recurrence?: NotificationRecurrence;
  repeatWeekday?: number;
};

type Store = {
  records: NotificationRecord[];
  templates: NotificationTemplate[];
  selectedImage?: string;
  hapticsEnabled: boolean;
  permission: Notifications.PermissionStatus | "unknown";
  setSelectedImage: (uri?: string) => Promise<void>;
  setHapticsEnabled: (value: boolean) => Promise<void>;
  refreshPermission: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
  emit: (input: Omit<NotificationRecord, "id" | "kind" | "status" | "createdAt" | "notificationId">) => Promise<boolean>;
  schedule: (input: Omit<NotificationRecord, "id" | "kind" | "status" | "createdAt" | "notificationId" | "recurrence" | "repeatWeekday">, timing: number | Date, recurrence?: NotificationRecurrence, repeatWeekday?: number) => Promise<void>;
  updateScheduled: (record: NotificationRecord, input: Omit<NotificationRecord, "id" | "kind" | "status" | "createdAt" | "notificationId">) => Promise<void>;
  refreshScheduled: () => Promise<void>;
  clearScheduled: () => Promise<void>;
  cancel: (record: NotificationRecord) => Promise<void>;
  remove: (record: NotificationRecord) => Promise<void>;
  clearHistory: () => Promise<void>;
  saveTemplate: (input: Omit<NotificationTemplate, "id" | "createdAt" | "updatedAt">, id?: string) => Promise<NotificationTemplate>;
  removeTemplate: (template: NotificationTemplate) => Promise<void>;
  refreshTemplates: () => Promise<void>;
  receipts: NotificationReceipt[];
  updateReceipt: (receiptId: string, input: Partial<Pick<NotificationReceipt, "amount" | "recipientName" | "document" | "institution">>) => Promise<void>;
};

const STORAGE_KEY = "notification-ios-records-v1";
const TEMPLATES_KEY = "notification-ios-templates-v1";
const IMAGE_KEY = "notification-ios-image-v1";
const HAPTICS_KEY = "notification-ios-haptics-v1";
const RECEIPTS_KEY = "notification-ios-receipts-v1";

function normalizeTemplates(raw: unknown): NotificationTemplate[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as Partial<NotificationTemplate>;
    const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
    const body = typeof candidate.body === "string" ? candidate.body : "";
    if (!name || !body) return [];
    const now = new Date().toISOString();
    return [{
      id: typeof candidate.id === "string" && candidate.id ? candidate.id : `template-recovered-${index}`,
      name,
      title: typeof candidate.title === "string" ? candidate.title : name,
      subtitle: typeof candidate.subtitle === "string" ? candidate.subtitle : "",
      body,
      createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : now,
      updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : now,
    }];
  });
}

async function readTemplatesSafely(): Promise<NotificationTemplate[]> {
  try {
    const stored = await AsyncStorage.getItem(TEMPLATES_KEY);
    if (!stored) return [];
    return normalizeTemplates(JSON.parse(stored));
  } catch (error) {
    console.error("[templates] failed to read local data", error);
    return [];
  }
}

async function readStoredValue(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`[storage] failed to read ${key}`, error);
    return null;
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function prepareAttachment(uri?: string) {
  if (!uri || Platform.OS === "web" || !FileSystem.cacheDirectory) return undefined;
  try {
    const suffix = Math.random().toString(36).slice(2, 8);
    const destination = `${FileSystem.cacheDirectory}${NOTIFICATION_ATTACHMENT_PREFIX}${Date.now()}-${suffix}.jpg`;
    await FileSystem.copyAsync({ from: uri, to: destination });
    return [{ identifier: "notification-image", url: destination, type: "jpg" }];
  } catch {
    return undefined;
  }
}

async function cleanupCachedAttachments(records: NotificationRecord[], selectedImage?: string) {
  if (Platform.OS === "web" || !FileSystem.cacheDirectory) return;
  // We do not track the native copy URI in records. Keep all cached attachments
  // while a scheduled record still references an image, avoiding a risky delete.
  if (records.some((record) => record.status === "pending" && record.imageUri)) return;
  const protectedUris = new Set(records.flatMap((record) => record.imageUri ? [record.imageUri] : []));
  if (selectedImage) protectedUris.add(selectedImage);
  try {
    const names = await FileSystem.readDirectoryAsync(FileSystem.cacheDirectory);
    const entries = (await Promise.all(names
      .filter((name) => name.startsWith(NOTIFICATION_ATTACHMENT_PREFIX))
      .map(async (name) => {
        const uri = `${FileSystem.cacheDirectory}${name}`;
        try {
          const info = await FileSystem.getInfoAsync(uri);
          const modificationTime = "modificationTime" in info && typeof info.modificationTime === "number"
            ? info.modificationTime
            : undefined;
          return {
            name,
            uri,
            modificationTimeMs: modificationTime === undefined ? undefined : modificationTime * 1000,
            isDirectory: info.isDirectory,
          };
        } catch {
          return null;
        }
      }))).flatMap((entry) => entry ? [entry] : []);
    const staleUris = getStaleNotificationAttachmentUris(entries, protectedUris);
    await Promise.all(staleUris.map((uri) => FileSystem.deleteAsync(uri, { idempotent: true })));
  } catch (error) {
    console.error("[attachments] failed to clean local cache", error);
  }
}

const StoreContext = createContext<Store | null>(null);

export function NotificationStoreProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<NotificationRecord[]>([]);
  const recordsRef = useRef<NotificationRecord[]>([]);
  const recordsLoadPromiseRef = useRef<Promise<void> | null>(null);
  const recordsWritePromiseRef = useRef<Promise<void>>(Promise.resolve());
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const templatesRef = useRef<NotificationTemplate[]>([]);
  const templatesLoadedRef = useRef(false);
  const templatesLoadPromiseRef = useRef<Promise<void> | null>(null);
  const templatesWriteInProgressRef = useRef(false);
  const [selectedImage, setSelectedImageState] = useState<string>();
  const selectedImageRef = useRef<string | undefined>(undefined);
  const [hapticsEnabled, setHapticsState] = useState(true);
  const [permission, setPermission] = useState<Notifications.PermissionStatus | "unknown">("unknown");
  const [receipts, setReceipts] = useState<NotificationReceipt[]>([]);
  const receiptsRef = useRef<NotificationReceipt[]>([]);
  const receiptsLoadPromiseRef = useRef<Promise<void> | null>(null);
  const receiptsWritePromiseRef = useRef<Promise<void>>(Promise.resolve());

  const refreshTemplates = useCallback(async () => {
    if (templatesWriteInProgressRef.current) return;
    const parsedTemplates = await readTemplatesSafely();
    templatesRef.current = parsedTemplates;
    templatesLoadedRef.current = true;
    setTemplates(parsedTemplates);
  }, []);

  const updateReceipts = (updater: (current: NotificationReceipt[]) => NotificationReceipt[]) => {
    const operation = receiptsWritePromiseRef.current.then(async () => {
      if (receiptsLoadPromiseRef.current) await receiptsLoadPromiseRef.current;
      const next = updater(receiptsRef.current);
      await AsyncStorage.setItem(RECEIPTS_KEY, JSON.stringify(next));
      receiptsRef.current = next;
      setReceipts(next);
    });
    receiptsWritePromiseRef.current = operation.catch(() => undefined);
    return operation;
  };

  const ensureReceiptsForRecords = async (sourceRecords: NotificationRecord[], eventTimes = new Map<string, string>()) => {
    const eligibleRecords = sourceRecords.filter((record) => record.status === "sent" || record.status === "delivered");
    if (eligibleRecords.length === 0) return;
    await updateReceipts((current) => {
      const existingRecordIds = new Set(current.map((receipt) => receipt.recordId));
      const additions = eligibleRecords
        .filter((record) => !existingRecordIds.has(record.id))
        .map((record) => {
          const eventAt = eventTimes.get(record.id) ?? getReceiptTimestamp(record);
          return {
            id: `receipt-${record.id}`,
            recordId: record.id,
            amount: extractReceiptAmount(record),
            recipientName: extractReceiptRecipientName(record),
            document: createMaskedDocument(),
            institution: "Cloudwalk Ip LTDA",
            transactionId: getReceiptTransactionId({ ...record, scheduledAt: eventAt }),
            createdAt: new Date().toISOString(),
            eventAt,
          } satisfies NotificationReceipt;
        });
      return additions.length > 0 ? [...additions, ...current] : current;
    });
  };

  useEffect(() => {
    recordsLoadPromiseRef.current = (async () => {
      const [storedRecords, storedImage, storedHaptics] = await Promise.all([
        readStoredValue(STORAGE_KEY),
        readStoredValue(IMAGE_KEY),
        readStoredValue(HAPTICS_KEY),
      ]);
      const parsedRecords = parseStoredNotificationRecords(storedRecords);
      recordsRef.current = parsedRecords;
      setRecords(parsedRecords);
      await ensureReceiptsForRecords(parsedRecords);
      await refreshTemplates();
      if (storedImage) {
        selectedImageRef.current = storedImage;
        setSelectedImageState(storedImage);
      }
      if (storedHaptics !== null) setHapticsState(storedHaptics !== "false");
      void cleanupCachedAttachments(parsedRecords, storedImage ?? undefined);
      await refreshPermission();
    })();
    receiptsLoadPromiseRef.current = readStoredValue(RECEIPTS_KEY).then((stored) => {
      const parsedReceipts = parseStoredNotificationReceipts(stored);
      receiptsRef.current = parsedReceipts;
      setReceipts(parsedReceipts);
    });
    templatesLoadPromiseRef.current = recordsLoadPromiseRef.current;
  }, []);

  const updateRecords = (updater: (current: NotificationRecord[]) => NotificationRecord[]) => {
    const operation = recordsWritePromiseRef.current.then(async () => {
      if (recordsLoadPromiseRef.current) await recordsLoadPromiseRef.current;
      const next = updater(recordsRef.current);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      recordsRef.current = next;
      setRecords(next);
    });
    recordsWritePromiseRef.current = operation.catch(() => undefined);
    return operation;
  };

  const refreshPermission = async () => {
    const result = await Notifications.getPermissionsAsync();
    setPermission(result.status);
  };

  const requestPermission = async () => {
    const current = await Notifications.getPermissionsAsync();
    const result = current.granted
      ? current
      : await Notifications.requestPermissionsAsync();
    setPermission(result.status);
    if (!result.granted) {
      Alert.alert("Notificações desativadas", "Autorize as notificações nos Ajustes do iOS para receber os avisos.", [
        { text: "Agora não", style: "cancel" },
        { text: "Abrir Ajustes", onPress: () => void Linking.openSettings() },
      ]);
    }
    return result.granted;
  };

  const buildContent = async (input: { title: string; subtitle: string; body: string; imageUri?: string }) => {
    const attachments = await prepareAttachment(input.imageUri);
    const subtitle = input.subtitle.trim();
    return {
      title: input.title,
      body: input.body,
      ...(subtitle ? { subtitle } : {}),
      ...(attachments ? { attachments } : {}),
      data: { imageUri: input.imageUri ?? null },
    } as Notifications.NotificationContentInput;
  };

  const emit = async (input: Omit<NotificationRecord, "id" | "kind" | "status" | "createdAt" | "notificationId">) => {
    if (!(await requestPermission())) return false;
    const content = await buildContent(input);
    let notificationId: string;
    try {
      notificationId = await Notifications.scheduleNotificationAsync({ content, trigger: null });
    } catch (firstError) {
      // iOS can reject a local attachment URI even while notification permission is granted.
      // Retry the same notification without the attachment so the core action still works.
      const { attachments: _attachments, ...contentWithoutAttachment } = content;
      try {
        notificationId = await Notifications.scheduleNotificationAsync({ content: contentWithoutAttachment, trigger: null });
      } catch {
        const detail = firstError instanceof Error ? firstError.message : "Falha nativa ao agendar a notificação.";
        console.error("[notifications] schedule failed", firstError);
        throw new Error(detail);
      }
    }
    const record: NotificationRecord = { ...input, id: `local-${Date.now()}`, kind: "immediate", status: "sent", createdAt: new Date().toISOString(), notificationId };
    await updateRecords((current) => [record, ...current]);
    await ensureReceiptsForRecords([record]);
    return true;
  };

  const schedule = async (input: Omit<NotificationRecord, "id" | "kind" | "status" | "createdAt" | "notificationId" | "recurrence" | "repeatWeekday">, timing: number | Date, recurrence: NotificationRecurrence = "once", repeatWeekday?: number) => {
    if (!(await requestPermission())) return;
    const scheduledAt = timing instanceof Date ? new Date(timing) : new Date(Date.now() + timing * 60_000);
    if (Number.isNaN(scheduledAt.getTime()) || (recurrence === "once" && scheduledAt.getTime() <= Date.now())) {
      throw new Error("Escolha uma data e um horário futuros.");
    }
    const weekday = repeatWeekday ?? scheduledAt.getDay() + 1;
    if (recurrence === "weekly" && (weekday < 1 || weekday > 7)) {
      throw new Error("Escolha um dia da semana válido.");
    }
    const trigger: Notifications.NotificationTriggerInput = recurrence === "daily"
      ? { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: scheduledAt.getHours(), minute: scheduledAt.getMinutes() }
      : recurrence === "weekly"
        ? { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday, hour: scheduledAt.getHours(), minute: scheduledAt.getMinutes() }
        : { type: Notifications.SchedulableTriggerInputTypes.DATE, date: scheduledAt };
    const notificationId = await Notifications.scheduleNotificationAsync({ content: await buildContent(input), trigger });
    const record: NotificationRecord = { ...input, id: `scheduled-${Date.now()}`, kind: "scheduled", status: "pending", createdAt: new Date().toISOString(), scheduledAt: scheduledAt.toISOString(), notificationId, recurrence, ...(recurrence === "weekly" ? { repeatWeekday: weekday } : {}) };
    await updateRecords((current) => [record, ...current]);
  };

  const updateScheduled = async (record: NotificationRecord, input: Omit<NotificationRecord, "id" | "kind" | "status" | "createdAt" | "notificationId">) => {
    if (record.status !== "pending" || !record.scheduledAt) throw new Error("Este agendamento não está mais pendente.");
    const scheduledAt = new Date(record.scheduledAt);
    const recurrence = record.recurrence ?? "once";
    if (recurrence === "once" && scheduledAt.getTime() <= Date.now()) throw new Error("O horário deste agendamento já passou.");
    if (Platform.OS === "web") {
      await updateRecords((current) => current.map((item) => item.id === record.id ? { ...item, ...input } : item));
      return;
    }
    const weekday = record.repeatWeekday ?? scheduledAt.getDay() + 1;
    const trigger: Notifications.NotificationTriggerInput = recurrence === "daily"
      ? { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: scheduledAt.getHours(), minute: scheduledAt.getMinutes() }
      : recurrence === "weekly"
        ? { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday, hour: scheduledAt.getHours(), minute: scheduledAt.getMinutes() }
        : { type: Notifications.SchedulableTriggerInputTypes.DATE, date: scheduledAt };
    const replacementId = await Notifications.scheduleNotificationAsync({ content: await buildContent(input), trigger });
    try {
      if (record.notificationId) await Notifications.cancelScheduledNotificationAsync(record.notificationId);
    } catch (error) {
      await Notifications.cancelScheduledNotificationAsync(replacementId).catch(() => undefined);
      throw error;
    }
    await updateRecords((current) => current.map((item) => item.id === record.id ? { ...item, ...input, notificationId: replacementId, recurrence, ...(recurrence === "weekly" ? { repeatWeekday: weekday } : {}) } : item));
  };

  const refreshScheduled = useCallback(async () => {
    if (Platform.OS === "web") return;
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const nativeIds = new Set(scheduled.map((item) => item.identifier));
    await updateRecords((current) => current.map((item) => {
      if (item.status !== "pending" || !item.notificationId || nativeIds.has(item.notificationId)) return item;
      return { ...item, status: "delivered" as const };
    }));
    await ensureReceiptsForRecords(recordsRef.current);
    void cleanupCachedAttachments(recordsRef.current, selectedImageRef.current);
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") return;
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      const notificationId = notification.request.identifier;
      const existing = recordsRef.current.find((record) => record.notificationId === notificationId);
      if (!existing) return;
      const eventAt = new Date().toISOString();
      const delivered = existing.status === "pending" ? { ...existing, status: "delivered" as const } : existing;
      void updateRecords((current) => current.map((item) => item.id === existing.id ? delivered : item))
        .then(() => ensureReceiptsForRecords([delivered], new Map([[existing.id, eventAt]])))
        .catch((error) => console.error("[receipts] failed to record received notification", error));
    });
    return () => subscription.remove();
  }, []);

  const clearScheduled = useCallback(async () => {
    if (Platform.OS !== "web") await Notifications.cancelAllScheduledNotificationsAsync();
    await updateRecords((current) => current.map((item) => item.status === "pending" ? { ...item, status: "cancelled" as const } : item));
    void cleanupCachedAttachments(recordsRef.current, selectedImageRef.current);
  }, []);

  const cancel = async (record: NotificationRecord) => {
    if (Platform.OS !== "web" && record.notificationId) await Notifications.cancelScheduledNotificationAsync(record.notificationId);
    await updateRecords((current) => current.map((item) => item.id === record.id ? { ...item, status: "cancelled" as const } : item));
    void cleanupCachedAttachments(recordsRef.current, selectedImageRef.current);
  };

  const remove = async (record: NotificationRecord) => {
    if (Platform.OS !== "web" && record.notificationId && record.status === "pending") await Notifications.cancelScheduledNotificationAsync(record.notificationId);
    await updateRecords((current) => current.filter((item) => item.id !== record.id));
    void cleanupCachedAttachments(recordsRef.current, selectedImageRef.current);
  };

  const clearHistory = async () => {
    await updateRecords((current) => current.filter((item) => item.status === "pending"));
    void cleanupCachedAttachments(recordsRef.current, selectedImageRef.current);
  };

  const saveTemplate = async (input: Omit<NotificationTemplate, "id" | "createdAt" | "updatedAt">, id?: string) => {
    if (!templatesLoadedRef.current && templatesLoadPromiseRef.current) await templatesLoadPromiseRef.current;
    const now = new Date().toISOString();
    const currentTemplates = templatesRef.current;
    const existing = id ? currentTemplates.find((item) => item.id === id) : undefined;
    const template: NotificationTemplate = {
      ...input,
      id: existing?.id ?? `template-${Date.now()}`,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    const next = existing ? currentTemplates.map((item) => item.id === template.id ? template : item) : [template, ...currentTemplates];
    templatesWriteInProgressRef.current = true;
    try {
      templatesRef.current = next;
      setTemplates(next);
      await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(next));
      const persistedTemplates = await readTemplatesSafely();
      if (!persistedTemplates.some((item) => item.id === template.id)) {
        throw new Error("O iPhone não confirmou a gravação do modelo.");
      }
      return template;
    } finally {
      templatesWriteInProgressRef.current = false;
    }
  };

  const removeTemplate = async (template: NotificationTemplate) => {
    const next = templatesRef.current.filter((item) => item.id !== template.id);
    templatesRef.current = next;
    setTemplates(next);
    try {
      await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(next));
    } catch (error) {
      console.error("[templates] failed to remove local item", error);
      throw new Error("Não foi possível atualizar os modelos salvos.");
    }
  };

  const setSelectedImage = async (uri?: string) => {
    selectedImageRef.current = uri;
    setSelectedImageState(uri);
    if (uri) await AsyncStorage.setItem(IMAGE_KEY, uri);
    else await AsyncStorage.removeItem(IMAGE_KEY);
  };

  const setHapticsEnabled = async (value: boolean) => {
    setHapticsState(value);
    await AsyncStorage.setItem(HAPTICS_KEY, String(value));
  };

  const updateReceipt = async (receiptId: string, input: Partial<Pick<NotificationReceipt, "amount" | "recipientName" | "document" | "institution">>) => {
    await updateReceipts((current) => current.map((receipt) => receipt.id === receiptId ? { ...receipt, ...input } : receipt));
  };

  const value = useMemo(() => ({ templates, records, selectedImage, hapticsEnabled, permission, receipts, setSelectedImage, setHapticsEnabled, refreshPermission, requestPermission, emit, schedule, updateScheduled, refreshScheduled, clearScheduled, cancel, remove, clearHistory, saveTemplate, removeTemplate, refreshTemplates, updateReceipt }), [templates, records, selectedImage, hapticsEnabled, permission, receipts]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useNotificationStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useNotificationStore must be used inside NotificationStoreProvider");
  return value;
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as FileSystem from "expo-file-system/legacy";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Alert, Linking, Platform } from "react-native";

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
};

type Store = {
  records: NotificationRecord[];
  selectedImage?: string;
  hapticsEnabled: boolean;
  permission: Notifications.PermissionStatus | "unknown";
  setSelectedImage: (uri?: string) => Promise<void>;
  setHapticsEnabled: (value: boolean) => Promise<void>;
  refreshPermission: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
  emit: (input: Omit<NotificationRecord, "id" | "kind" | "status" | "createdAt" | "notificationId">) => Promise<void>;
  schedule: (input: Omit<NotificationRecord, "id" | "kind" | "status" | "createdAt" | "notificationId">, minutes: number) => Promise<void>;
  cancel: (record: NotificationRecord) => Promise<void>;
  remove: (record: NotificationRecord) => Promise<void>;
  clearHistory: () => Promise<void>;
};

const STORAGE_KEY = "notification-ios-records-v1";
const IMAGE_KEY = "notification-ios-image-v1";
const HAPTICS_KEY = "notification-ios-haptics-v1";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function prepareAttachment(uri?: string) {
  if (!uri || Platform.OS === "web") return undefined;
  try {
    const destination = `${FileSystem.cacheDirectory}notification-attachment-${Date.now()}.jpg`;
    await FileSystem.copyAsync({ from: uri, to: destination });
    return [{ identifier: "notification-image", url: destination, type: "jpg" }];
  } catch {
    return undefined;
  }
}

const StoreContext = createContext<Store | null>(null);

export function NotificationStoreProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<NotificationRecord[]>([]);
  const [selectedImage, setSelectedImageState] = useState<string>();
  const [hapticsEnabled, setHapticsState] = useState(true);
  const [permission, setPermission] = useState<Notifications.PermissionStatus | "unknown">("unknown");

  useEffect(() => {
    void (async () => {
      const [storedRecords, storedImage, storedHaptics] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(IMAGE_KEY),
        AsyncStorage.getItem(HAPTICS_KEY),
      ]);
      if (storedRecords) setRecords(JSON.parse(storedRecords));
      if (storedImage) setSelectedImageState(storedImage);
      if (storedHaptics !== null) setHapticsState(storedHaptics !== "false");
      await refreshPermission();
    })();
  }, []);

  const persistRecords = async (next: NotificationRecord[]) => {
    setRecords(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const refreshPermission = async () => {
    const result = await Notifications.getPermissionsAsync();
    setPermission(result.status);
  };

  const requestPermission = async () => {
    const current = await Notifications.getPermissionsAsync();
    const result = current.status === Notifications.PermissionStatus.GRANTED
      ? current
      : await Notifications.requestPermissionsAsync();
    setPermission(result.status);
    if (result.status !== Notifications.PermissionStatus.GRANTED) {
      Alert.alert("Notificações desativadas", "Autorize as notificações nos Ajustes do iOS para receber os avisos.", [
        { text: "Agora não", style: "cancel" },
        { text: "Abrir Ajustes", onPress: () => void Linking.openSettings() },
      ]);
    }
    return result.status === Notifications.PermissionStatus.GRANTED;
  };

  const buildContent = async (input: { title: string; subtitle: string; body: string; imageUri?: string }) => {
    const attachments = await prepareAttachment(input.imageUri);
    return {
      title: input.title,
      subtitle: input.subtitle || undefined,
      body: input.body,
      ...(attachments ? { attachments } : {}),
      data: { imageUri: input.imageUri ?? null },
    } as Notifications.NotificationContentInput;
  };

  const emit = async (input: Omit<NotificationRecord, "id" | "kind" | "status" | "createdAt" | "notificationId">) => {
    if (!(await requestPermission())) return;
    const notificationId = await Notifications.scheduleNotificationAsync({ content: await buildContent(input), trigger: null });
    const record: NotificationRecord = { ...input, id: `local-${Date.now()}`, kind: "immediate", status: "sent", createdAt: new Date().toISOString(), notificationId };
    await persistRecords([record, ...records]);
  };

  const schedule = async (input: Omit<NotificationRecord, "id" | "kind" | "status" | "createdAt" | "notificationId">, minutes: number) => {
    if (!(await requestPermission())) return;
    const scheduledAt = new Date(Date.now() + minutes * 60_000);
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: await buildContent(input),
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: scheduledAt },
    });
    const record: NotificationRecord = { ...input, id: `scheduled-${Date.now()}`, kind: "scheduled", status: "pending", createdAt: new Date().toISOString(), scheduledAt: scheduledAt.toISOString(), notificationId };
    await persistRecords([record, ...records]);
  };

  const cancel = async (record: NotificationRecord) => {
    if (record.notificationId) await Notifications.cancelScheduledNotificationAsync(record.notificationId);
    await persistRecords(records.map((item) => item.id === record.id ? { ...item, status: "cancelled" as const } : item));
  };

  const remove = async (record: NotificationRecord) => {
    if (record.notificationId && record.status === "pending") await Notifications.cancelScheduledNotificationAsync(record.notificationId);
    await persistRecords(records.filter((item) => item.id !== record.id));
  };

  const clearHistory = async () => {
    await persistRecords(records.filter((item) => item.status === "pending"));
  };

  const setSelectedImage = async (uri?: string) => {
    setSelectedImageState(uri);
    if (uri) await AsyncStorage.setItem(IMAGE_KEY, uri);
    else await AsyncStorage.removeItem(IMAGE_KEY);
  };

  const setHapticsEnabled = async (value: boolean) => {
    setHapticsState(value);
    await AsyncStorage.setItem(HAPTICS_KEY, String(value));
  };

  const value = useMemo(() => ({ records, selectedImage, hapticsEnabled, permission, setSelectedImage, setHapticsEnabled, refreshPermission, requestPermission, emit, schedule, cancel, remove, clearHistory }), [records, selectedImage, hapticsEnabled, permission]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useNotificationStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useNotificationStore must be used inside NotificationStoreProvider");
  return value;
}

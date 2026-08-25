import type { NotificationRecord } from "./notification-store";

const recordStatuses = new Set<NotificationRecord["status"]>(["sent", "pending", "cancelled", "delivered"]);
const recurrences = new Set<NonNullable<NotificationRecord["recurrence"]>>(["once", "daily", "weekly"]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeNotificationRecords(raw: unknown): NotificationRecord[] {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((item, index) => {
    if (!isObject(item)) return [];
    const candidate = item as Partial<NotificationRecord>;
    if (!isNonEmptyString(candidate.title) || !isNonEmptyString(candidate.body)) return [];

    const kind: NotificationRecord["kind"] = candidate.kind === "scheduled" ? "scheduled" : "immediate";
    const status: NotificationRecord["status"] = recordStatuses.has(candidate.status as NotificationRecord["status"])
      ? candidate.status as NotificationRecord["status"]
      : kind === "scheduled" ? "pending" : "sent";
    const now = new Date().toISOString();
    const record: NotificationRecord = {
      id: isNonEmptyString(candidate.id) ? candidate.id : `recovered-${index}`,
      title: candidate.title,
      subtitle: typeof candidate.subtitle === "string" ? candidate.subtitle : "",
      body: candidate.body,
      kind,
      status,
      createdAt: isNonEmptyString(candidate.createdAt) ? candidate.createdAt : now,
      ...(isNonEmptyString(candidate.imageUri) ? { imageUri: candidate.imageUri } : {}),
      ...(isNonEmptyString(candidate.scheduledAt) ? { scheduledAt: candidate.scheduledAt } : {}),
      ...(isNonEmptyString(candidate.notificationId) ? { notificationId: candidate.notificationId } : {}),
      ...(recurrences.has(candidate.recurrence as NonNullable<NotificationRecord["recurrence"]>) ? { recurrence: candidate.recurrence } : {}),
      ...(typeof candidate.repeatWeekday === "number" && Number.isInteger(candidate.repeatWeekday) && candidate.repeatWeekday >= 1 && candidate.repeatWeekday <= 7
        ? { repeatWeekday: candidate.repeatWeekday }
        : {}),
    };
    return [record];
  });
}

export function parseStoredNotificationRecords(stored: string | null): NotificationRecord[] {
  if (!stored) return [];
  try {
    return normalizeNotificationRecords(JSON.parse(stored));
  } catch (error) {
    console.error("[records] failed to parse local data", error);
    return [];
  }
}

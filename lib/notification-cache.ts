export const NOTIFICATION_ATTACHMENT_PREFIX = "notification-attachment-";
export const NOTIFICATION_ATTACHMENT_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

export type CacheEntry = {
  uri: string;
  name: string;
  modificationTimeMs?: number;
  isDirectory?: boolean;
};

export function getStaleNotificationAttachmentUris(
  entries: CacheEntry[],
  protectedUris: ReadonlySet<string>,
  nowMs = Date.now(),
  retentionMs = NOTIFICATION_ATTACHMENT_RETENTION_MS,
): string[] {
  return entries.flatMap((entry) => {
    if (!entry.name.startsWith(NOTIFICATION_ATTACHMENT_PREFIX)) return [];
    if (entry.isDirectory || protectedUris.has(entry.uri)) return [];
    if (typeof entry.modificationTimeMs !== "number" || !Number.isFinite(entry.modificationTimeMs)) return [];
    if (nowMs - entry.modificationTimeMs <= retentionMs) return [];
    return [entry.uri];
  });
}

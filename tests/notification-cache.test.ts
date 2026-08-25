import { describe, expect, it } from "vitest";
import {
  NOTIFICATION_ATTACHMENT_RETENTION_MS,
  getStaleNotificationAttachmentUris,
} from "../lib/notification-cache";

describe("notification cache", () => {
  const now = 1_000_000;
  const old = now - NOTIFICATION_ATTACHMENT_RETENTION_MS - 1;

  it("seleciona somente anexos próprios antigos e não protegidos", () => {
    const protectedUri = "file:///cache/notification-attachment-protected.jpg";
    const staleUri = "file:///cache/notification-attachment-old.jpg";
    const removable = getStaleNotificationAttachmentUris([
      { name: "notification-attachment-old.jpg", uri: staleUri, modificationTimeMs: old },
      { name: "notification-attachment-protected.jpg", uri: protectedUri, modificationTimeMs: old },
      { name: "other-app-file.jpg", uri: "file:///cache/other-app-file.jpg", modificationTimeMs: old },
    ], new Set([protectedUri]), now);

    expect(removable).toEqual([staleUri]);
  });

  it("preserva arquivos recentes, diretórios e entradas sem data confiável", () => {
    const result = getStaleNotificationAttachmentUris([
      { name: "notification-attachment-recent.jpg", uri: "recent", modificationTimeMs: now },
      { name: "notification-attachment-directory", uri: "directory", modificationTimeMs: old, isDirectory: true },
      { name: "notification-attachment-unknown.jpg", uri: "unknown" },
    ], new Set(), now);

    expect(result).toEqual([]);
  });
});

import { normalizeReceiptDocument } from "./receipt-utils";

export type NotificationReceipt = {
  id: string;
  recordId: string;
  amount: string;
  recipientName: string;
  document: string;
  institution: string;
  transactionId: string;
  createdAt: string;
  eventAt: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function nonEmpty(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function normalizeNotificationReceipts(raw: unknown): NotificationReceipt[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item, index) => {
    if (!isObject(item)) return [];
    const candidate = item as Partial<NotificationReceipt>;
    const recordId = nonEmpty(candidate.recordId, "");
    if (!recordId) return [];
    const now = new Date().toISOString();
    return [{
      id: nonEmpty(candidate.id, `receipt-recovered-${index}`),
      recordId,
      amount: nonEmpty(candidate.amount, "0,00"),
      recipientName: nonEmpty(candidate.recipientName, "Nome do recebedor"),
      document: normalizeReceiptDocument(nonEmpty(candidate.document, "***.000.000-**")),
      institution: nonEmpty(candidate.institution, "Cloudwalk Ip LTDA"),
      transactionId: nonEmpty(candidate.transactionId, `E004${Date.now()}${index}`),
      createdAt: nonEmpty(candidate.createdAt, now),
      eventAt: nonEmpty(candidate.eventAt, nonEmpty(candidate.createdAt, now)),
    } satisfies NotificationReceipt];
  });
}

export function parseStoredNotificationReceipts(stored: string | null): NotificationReceipt[] {
  if (!stored) return [];
  try {
    return normalizeNotificationReceipts(JSON.parse(stored));
  } catch (error) {
    console.error("[receipts] failed to parse local data", error);
    return [];
  }
}

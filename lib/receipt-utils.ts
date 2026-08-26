import type { NotificationRecord } from "./notification-store";

const weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function getReceiptTimestamp(record: Pick<NotificationRecord, "kind" | "createdAt" | "scheduledAt">) {
  return record.kind === "scheduled" ? record.scheduledAt ?? record.createdAt : record.createdAt;
}

export function getReceiptTransactionId(record: Pick<NotificationRecord, "id" | "notificationId" | "kind" | "createdAt" | "scheduledAt">) {
  const timestamp = getReceiptTimestamp(record);
  const date = new Date(timestamp);
  const pad = (number: number) => String(number).padStart(2, "0");
  const dateStamp = Number.isNaN(date.getTime())
    ? "000000000000"
    : `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}`;
  const source = `${record.id}:${record.notificationId ?? ""}`;
  let hash = 0;
  for (const character of source) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  const token = hash.toString(36).toUpperCase().padStart(16, "0").slice(0, 16);
  return `E004${dateStamp}${token}`;
}

export function formatReceiptDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data indisponível";
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${weekdays[date.getDay()]}, ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function formatReceiptTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--h--";
  return `${String(date.getHours()).padStart(2, "0")}h${String(date.getMinutes()).padStart(2, "0")}`;
}

export function extractReceiptRecipientName(record: Pick<NotificationRecord, "title" | "body">) {
  const sentMatch = record.body.match(/\bpara\s+(.+?)(?:\.|$)/i);
  if (sentMatch?.[1]?.trim()) return sentMatch[1].trim();
  const receivedMatch = record.body.match(/^(.+?)\s+te enviou\b/i);
  if (receivedMatch?.[1]?.trim()) return receivedMatch[1].trim();
  return record.title.trim() || "Nome do recebedor";
}

function deterministicDocumentSuffix(seed: string) {
  let hash = 0;
  for (const character of seed) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return String(hash % 100).padStart(2, "0");
}

export function createMaskedDocument() {
  const first = Math.floor(Math.random() * 1_000).toString().padStart(3, "0");
  const second = Math.floor(Math.random() * 1_000).toString().padStart(3, "0");
  const suffix = Math.floor(Math.random() * 100).toString().padStart(2, "0");
  return `***.${first}.${second}-${suffix}`;
}

export function normalizeReceiptDocument(value: string) {
  const trimmed = value.trim();
  const maskedMatch = trimmed.match(/^\*{3}\.(\d{3})\.(\d{3})-(\d{2}|\*{2})$/);
  if (maskedMatch) {
    const suffix = maskedMatch[3] === "**" ? deterministicDocumentSuffix(`${maskedMatch[1]}.${maskedMatch[2]}`) : maskedMatch[3];
    return `***.${maskedMatch[1]}.${maskedMatch[2]}-${suffix}`;
  }
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 8) return `***.${digits.slice(-8, -5)}.${digits.slice(-5, -2)}-${digits.slice(-2)}`;
  if (digits.length >= 6) return `***.${digits.slice(0, 3)}.${digits.slice(3, 6)}-${deterministicDocumentSuffix(digits)}`;
  return trimmed || "***.000.000-00";
}

export function normalizeReceiptAmount(value: string) {
  const raw = value.trim().replace(/R\$\s*/i, "").replace(/\s/g, "");
  if (!raw) return "0,00";
  const hasComma = raw.includes(",");
  const parts = raw.split(hasComma ? "," : ".");
  const integerPart = (parts[0] ?? "").replace(/\D/g, "") || "0";
  const decimalPart = hasComma
    ? (parts[1] ?? "").replace(/\D/g, "")
    : parts.length === 2 && (parts[1] ?? "").length <= 2 ? (parts[1] ?? "").replace(/\D/g, "") : "";
  const groupedInteger = integerPart.replace(/^0+(?=\d)/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "0";
  return `${groupedInteger},${decimalPart.padEnd(2, "0").slice(0, 2)}`;
}

export function extractReceiptAmount(record: Pick<NotificationRecord, "title" | "subtitle" | "body">) {
  const text = `${record.title} ${record.subtitle} ${record.body}`;
  const match = text.match(/R\$\s*([\d.]+(?:,[\d]{1,2})?|[\d]+(?:\.[\d]{1,2})?)/i);
  if (!match?.[1]) return "0,00";
  return normalizeReceiptAmount(match[1]);
}

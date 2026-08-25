import type { NotificationRecord } from "./notification-store";

const weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

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

export function extractReceiptAmount(record: Pick<NotificationRecord, "title" | "subtitle" | "body">) {
  const text = `${record.title} ${record.subtitle} ${record.body}`;
  const match = text.match(/R\$\s*([\d.]+(?:,[\d]{1,2})?|[\d]+(?:\.[\d]{1,2})?)/i);
  if (!match?.[1]) return "0,00";
  const normalized = match[1].includes(",") ? match[1] : match[1].replace(".", ",");
  const [integerPart, decimalPart = "00"] = normalized.split(",");
  return `${integerPart},${decimalPart.padEnd(2, "0").slice(0, 2)}`;
}

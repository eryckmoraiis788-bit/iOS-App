import { describe, expect, it } from "vitest";
import { extractReceiptAmount, formatReceiptDate, formatReceiptTime, getReceiptTimestamp, getReceiptTransactionId } from "../lib/receipt-utils";

describe("receipt utils", () => {
  const record = {
    title: "Pix enviado",
    subtitle: "",
    body: "Você fez um Pix no valor de R$ 1.234,50 para uma pessoa.",
  };

  it("extrai o valor monetário da notificação", () => {
    expect(extractReceiptAmount(record)).toBe("1.234,50");
    expect(extractReceiptAmount({ ...record, body: "Notificação sem valor" })).toBe("0,00");
  });

  it("formata data e horário do registro", () => {
    const value = "2026-08-25T19:07:00.000Z";
    const date = new Date(value);
    expect(formatReceiptDate(value)).toContain("25/08/2026");
    expect(formatReceiptTime(value)).toBe(`${String(date.getHours()).padStart(2, "0")}h07`);
  });

  it("usa o horário programado para comprovantes agendados", () => {
    expect(getReceiptTimestamp({ kind: "scheduled", createdAt: "2026-08-25T10:00:00.000Z", scheduledAt: "2026-08-25T19:07:00.000Z" })).toBe("2026-08-25T19:07:00.000Z");
    expect(getReceiptTimestamp({ kind: "immediate", createdAt: "2026-08-25T19:07:00.000Z" })).toBe("2026-08-25T19:07:00.000Z");
  });

  it("gera um ID determinístico no formato do comprovante Pix", () => {
    const input = { id: "record-1", notificationId: "notification-1", kind: "immediate" as const, createdAt: "2026-08-25T19:07:00.000Z" };
    const transactionId = getReceiptTransactionId(input);
    expect(transactionId).toMatch(/^E004202608251907[A-Z0-9]{20}$/);
    expect(getReceiptTransactionId(input)).toBe(transactionId);
  });

  it("retorna fallback para datas inválidas", () => {
    expect(formatReceiptDate("invalid")).toBe("Data indisponível");
    expect(formatReceiptTime("invalid")).toBe("--h--");
  });
});

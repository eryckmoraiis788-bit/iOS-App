import { describe, expect, it } from "vitest";
import { extractReceiptAmount, formatReceiptDate, formatReceiptTime } from "../lib/receipt-utils";

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

  it("retorna fallback para datas inválidas", () => {
    expect(formatReceiptDate("invalid")).toBe("Data indisponível");
    expect(formatReceiptTime("invalid")).toBe("--h--");
  });
});

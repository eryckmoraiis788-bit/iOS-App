import { describe, expect, it } from "vitest";
import { normalizeNotificationReceipts, parseStoredNotificationReceipts } from "../lib/receipt-storage";

describe("receipt storage", () => {
  it("normaliza um comprovante completo", () => {
    const [receipt] = normalizeNotificationReceipts([{
      id: "receipt-1",
      recordId: "record-1",
      amount: "0,01",
      recipientName: "Pessoa Recebedora",
      document: "***.123.456-78",
      institution: "Instituição de teste",
      transactionId: "E004202608251907ABC",
      createdAt: "2026-08-25T19:07:00.000Z",
      eventAt: "2026-08-25T19:07:00.000Z",
    }]);
    expect(receipt).toMatchObject({ recordId: "record-1", recipientName: "Pessoa Recebedora", document: "***.123.456-**", institution: "Instituição de teste" });
  });

  it("aplica defaults a campos ausentes e descarta itens sem recordId", () => {
    const result = normalizeNotificationReceipts([{ recordId: "record-2" }, { institution: "sem registro" }, "corrompido"]);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ recordId: "record-2", amount: "0,00", recipientName: "Nome do recebedor", document: "***.000.000-**", institution: "Cloudwalk Ip LTDA" });
  });

  it("não interrompe a inicialização quando o JSON está corrompido", () => {
    expect(parseStoredNotificationReceipts("{not-json")).toEqual([]);
  });
});

import { describe, expect, it, vi } from "vitest";
import { normalizeNotificationRecords, parseStoredNotificationRecords } from "../lib/notification-storage";

describe("notification storage", () => {
  it("preserva registros válidos e normaliza campos opcionais", () => {
    const records = normalizeNotificationRecords([{
      id: "record-1",
      title: "Pagamento recebido",
      subtitle: null,
      body: "Você recebeu R$ 10,00.",
      kind: "scheduled",
      status: "pending",
      createdAt: "2026-08-25T12:00:00.000Z",
      recurrence: "weekly",
      repeatWeekday: 3,
    }]);

    expect(records).toEqual([{
      id: "record-1",
      title: "Pagamento recebido",
      subtitle: "",
      body: "Você recebeu R$ 10,00.",
      kind: "scheduled",
      status: "pending",
      createdAt: "2026-08-25T12:00:00.000Z",
      recurrence: "weekly",
      repeatWeekday: 3,
    }]);
  });

  it("descarta itens incompletos e corrige status inválidos", () => {
    const records = normalizeNotificationRecords([
      { title: "", body: "sem título" },
      { title: "Título", body: "Corpo", kind: "immediate", status: "unknown" },
      "not-a-record",
      null,
    ]);

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({ title: "Título", body: "Corpo", kind: "immediate", status: "sent" });
  });

  it("retorna lista vazia para JSON nulo ou corrompido", () => {
    expect(parseStoredNotificationRecords(null)).toEqual([]);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(parseStoredNotificationRecords("{" )).toEqual([]);
    expect(error).toHaveBeenCalledOnce();
    error.mockRestore();
  });
});

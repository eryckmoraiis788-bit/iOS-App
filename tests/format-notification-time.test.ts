import { describe, expect, it } from "vitest";

import { formatNotificationTime } from "../lib/format-notification-time";

describe("formatNotificationTime", () => {
  const now = new Date(2026, 7, 21, 7, 45, 0);

  it("exibe agora para notificações com menos de um minuto", () => {
    expect(formatNotificationTime(new Date(2026, 7, 21, 7, 44, 30).toISOString(), now)).toBe("agora");
  });

  it("exibe minutos relativos", () => {
    expect(formatNotificationTime(new Date(2026, 7, 21, 7, 17).toISOString(), now)).toBe("há 28min");
  });

  it("exibe horas relativas sem horário absoluto", () => {
    expect(formatNotificationTime(new Date(2026, 7, 21, 4, 45).toISOString(), now)).toBe("há 3h");
  });

  it("exibe dias relativos em vez de Ontem ou data absoluta", () => {
    expect(formatNotificationTime(new Date(2026, 7, 20, 7, 45).toISOString(), now)).toBe("há 1 dia");
    expect(formatNotificationTime(new Date(2026, 7, 18, 7, 45).toISOString(), now)).toBe("há 3 dias");
  });

  it("exibe tempo relativo para agendamentos futuros", () => {
    expect(formatNotificationTime(new Date(2026, 7, 21, 7, 50).toISOString(), now)).toBe("em 5min");
    expect(formatNotificationTime(new Date(2026, 7, 21, 9, 45).toISOString(), now)).toBe("em 2h");
  });
});

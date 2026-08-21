import { describe, expect, it } from "vitest";

import { formatNotificationTime } from "../lib/format-notification-time";

describe("formatNotificationTime", () => {
  const now = new Date(2026, 7, 21, 22, 57, 0);

  it("exibe horas relativas no formato desejado", () => {
    expect(formatNotificationTime(new Date(2026, 7, 21, 19, 57).toISOString(), now)).toBe("há 3h");
  });

  it("exibe minutos relativos para notificações recentes", () => {
    expect(formatNotificationTime(new Date(2026, 7, 21, 22, 42).toISOString(), now)).toBe("há 15min");
  });

  it("exibe o horário para notificações do mesmo dia com mais de 24 horas impossíveis por relógio local", () => {
    expect(formatNotificationTime(new Date(2026, 7, 21, 15, 40).toISOString(), now)).toBe("há 7h");
  });

  it("exibe ontem com horário", () => {
    expect(formatNotificationTime(new Date(2026, 7, 20, 17, 30).toISOString(), now)).toBe("Ontem, 17:30");
  });

  it("exibe uma data anterior com dia, mês e horário", () => {
    expect(formatNotificationTime(new Date(2026, 7, 18, 12, 28).toISOString(), now)).toBe("18/08, 12:28");
  });
});

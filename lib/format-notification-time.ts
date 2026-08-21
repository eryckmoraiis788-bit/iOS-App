const PT_BR_TIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const PT_BR_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function startOfLocalDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
}

/**
 * Formats notification timestamps in the same compact, relative style used by iOS.
 * The optional `now` parameter keeps the function deterministic in tests.
 */
export function formatNotificationTime(isoDate: string, now = new Date()): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "horário indisponível";

  const elapsedMs = Math.max(0, now.getTime() - date.getTime());
  const elapsedMinutes = Math.floor(elapsedMs / 60_000);
  const elapsedHours = Math.floor(elapsedMs / 3_600_000);

  if (elapsedMinutes < 1) return "agora";
  if (elapsedMinutes < 60) return `há ${elapsedMinutes}min`;
  if (elapsedHours < 24) return `há ${elapsedHours}h`;

  const dayDifference = Math.floor(
    (startOfLocalDay(now) - startOfLocalDay(date)) / 86_400_000,
  );

  if (dayDifference === 1) return `Ontem, ${PT_BR_TIME_FORMATTER.format(date)}`;
  if (dayDifference === 0) return PT_BR_TIME_FORMATTER.format(date);
  return PT_BR_DATE_TIME_FORMATTER.format(date);
}

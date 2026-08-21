/**
 * Formats notification timestamps using only relative Portuguese labels.
 * The optional `now` parameter keeps the function deterministic in tests.
 */
export function formatNotificationTime(isoDate: string, now = new Date()): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "horário indisponível";

  const differenceMs = now.getTime() - date.getTime();
  const absoluteMinutes = Math.floor(Math.abs(differenceMs) / 60_000);
  const absoluteHours = Math.floor(Math.abs(differenceMs) / 3_600_000);
  const absoluteDays = Math.floor(Math.abs(differenceMs) / 86_400_000);
  const prefix = differenceMs >= 0 ? "há" : "em";

  if (absoluteMinutes < 1) return differenceMs >= 0 ? "agora" : "em instantes";
  if (absoluteMinutes < 60) return `${prefix} ${absoluteMinutes}min`;
  if (absoluteHours < 24) return `${prefix} ${absoluteHours}h`;
  return `${prefix} ${absoluteDays} ${absoluteDays === 1 ? "dia" : "dias"}`;
}

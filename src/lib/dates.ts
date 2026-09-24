// Dates in content are partial on purpose: some roles are only known by year.
export type PartialDate = { year: number; month?: number };

export type DateRange = { start: PartialDate; end: PartialDate | null };

// Narrow on purpose: satisfied by both Intl.DateTimeFormat and next-intl's `format.dateTime`.
type MonthYearOptions = { year: "numeric"; month: "short"; timeZone: string };
type DateTimeFormatter = (date: Date, options: MonthYearOptions) => string;

export function toDate({ year, month = 1 }: PartialDate): Date {
  return new Date(Date.UTC(year, month - 1, 1));
}

// Machine-readable value for <time dateTime>.
export function toIsoValue({ year, month }: PartialDate): string {
  return month ? `${year}-${String(month).padStart(2, "0")}` : String(year);
}

export function formatPartialDate(date: PartialDate, format: DateTimeFormatter): string {
  return date.month
    ? format(toDate(date), { year: "numeric", month: "short", timeZone: "UTC" })
    : String(date.year);
}

export function fullYearsSince(start: PartialDate, now: Date = new Date()): number {
  const months =
    (now.getUTCFullYear() - start.year) * 12 + (now.getUTCMonth() + 1 - (start.month ?? 1));
  return Math.max(0, Math.floor(months / 12));
}

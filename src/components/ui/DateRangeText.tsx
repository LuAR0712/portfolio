import { useFormatter, useTranslations } from "next-intl";
import { formatPartialDate, toIsoValue, type DateRange } from "@/lib/dates";

export function DateRangeText({ start, end }: DateRange) {
  const t = useTranslations("dates");
  const format = useFormatter();
  const formatDate = (date: DateRange["start"]) =>
    formatPartialDate(date, (value, options) => format.dateTime(value, options));

  return (
    <span className="whitespace-nowrap">
      <time dateTime={toIsoValue(start)}>{formatDate(start)}</time>
      {" – "}
      {end ? <time dateTime={toIsoValue(end)}>{formatDate(end)}</time> : t("present")}
    </span>
  );
}

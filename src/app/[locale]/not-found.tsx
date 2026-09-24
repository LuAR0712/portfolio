import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <Container className="flex min-h-[60dvh] flex-col justify-center gap-6 py-section">
      <h1 className="text-h1">{t("title")}</h1>
      <p className="max-w-prose text-lg text-muted">{t("description")}</p>
      <Link href="/" className="font-medium text-primary underline underline-offset-4">
        {t("back")}
      </Link>
    </Container>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { useIsClient } from "@/hooks/useIsClient";

const RESET_MS = 2000;

/*
 * Copies the email address. A mailto: link does nothing for people without a configured mail
 * client (common on work machines), so copying is the reliable path to getting in touch.
 * The confirmation is announced through a polite live region.
 */
export function CopyEmailButton({ email }: { email: string }) {
  const t = useTranslations("copyEmail");
  const isClient = useIsClient();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), RESET_MS);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  // Without the Clipboard API (old browsers, insecure contexts) the button would do nothing.
  if (!isClient || !navigator.clipboard) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Permission denied: the mailto link next to this button still works.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={t("copyLabel")}
      className={buttonStyles("secondary", "px-4")}
    >
      <Icon name={copied ? "check" : "copy"} className="size-4" />
      <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
    </button>
  );
}

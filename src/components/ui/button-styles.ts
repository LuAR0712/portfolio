import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";

// `group` lets icons inside react to hover. The lift is transform-only and skipped with reduced motion.
const base =
  "group inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 font-medium whitespace-nowrap transition-[background-color,border-color,color,text-decoration-color,translate,box-shadow,opacity] duration-(--duration-fast) disabled:cursor-not-allowed disabled:opacity-70";

const lift = "motion-safe:not-disabled:hover:-translate-y-0.5 motion-safe:active:translate-y-0";

const variants: Record<ButtonVariant, string> = {
  primary: cn("bg-primary text-primary-fg shadow-soft hover:bg-primary/90 hover:shadow-lift", lift),
  secondary: cn("border border-border bg-surface/70 text-fg hover:border-fg/40", lift),
  ghost: "px-2 text-fg underline decoration-border underline-offset-6 hover:decoration-fg",
};

// Shared by <ButtonLink> and the form <Button>, so links and buttons look the same.
export function buttonStyles(variant: ButtonVariant = "primary", className?: string): string {
  return cn(base, variants[variant], className);
}

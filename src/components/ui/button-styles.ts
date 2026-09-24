import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 font-medium whitespace-nowrap transition-[background-color,border-color,color] duration-(--duration-fast)";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-fg hover:bg-primary/90",
  secondary: "border border-border bg-surface/70 text-fg hover:border-fg/40",
  ghost: "px-2 text-fg underline decoration-border underline-offset-6 hover:decoration-fg",
};

// Shared by <ButtonLink> and the form <Button>, so links and buttons look the same.
export function buttonStyles(variant: ButtonVariant = "primary", className?: string): string {
  return cn(base, variants[variant], className);
}

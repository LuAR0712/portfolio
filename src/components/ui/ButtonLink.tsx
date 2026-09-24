import type { ComponentProps } from "react";
import { buttonStyles, type ButtonVariant } from "./button-styles";

type ButtonLinkProps = ComponentProps<"a"> & { href: string; variant?: ButtonVariant };

// An anchor styled as a button: for navigation (in-page anchors, downloads), not actions.
export function ButtonLink({ variant, className, ...props }: ButtonLinkProps) {
  return <a className={buttonStyles(variant, className)} {...props} />;
}

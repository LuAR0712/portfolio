import type { ComponentProps } from "react";
import { buttonStyles, type ButtonVariant } from "./button-styles";

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant };

// For actions. Use <ButtonLink> for navigation.
export function Button({ variant, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles(variant, className)} {...props} />;
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { fieldError } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type ControlProps = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
  "aria-required": boolean | undefined;
};

type FormFieldProps = {
  id: string;
  label: string;
  optionalLabel?: string;
  error?: string;
  // Extra text tied to the control (limits, counter). Rendered under it, before the error.
  description?: ReactNode;
  children: (props: ControlProps) => ReactNode;
};

export const controlStyles = cn(
  "block w-full rounded-md border border-border bg-surface px-4 py-3 text-fg",
  "transition-[border-color,box-shadow] duration-(--duration-fast) hover:border-fg/30",
  "aria-invalid:border-danger aria-invalid:hover:border-danger",
);

// Label, control, description and error wired together through ids, so assistive tech reads
// the error and the limits along with the field.
export function FormField({
  id,
  label,
  optionalLabel,
  error,
  description,
  children,
}: FormFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-baseline gap-2 text-sm font-medium">
        {label}
        {optionalLabel && <span className="font-normal text-muted">({optionalLabel})</span>}
      </label>

      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
        "aria-required": optionalLabel ? undefined : true,
      })}

      {description && (
        <div id={descriptionId} className="text-sm text-muted">
          {description}
        </div>
      )}

      <AnimatePresence initial={false} mode="wait">
        {error && (
          <motion.p
            key={error}
            id={errorId}
            className="text-sm text-danger"
            variants={fieldError}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

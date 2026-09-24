type ClassValue = string | false | null | undefined;

// Joins class names, skipping falsy values. Components are designed so classes never conflict.
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

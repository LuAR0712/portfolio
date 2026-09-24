import type { DateRange } from "@/lib/dates";

// Client projects are internal systems: described by technical challenge and role only.
// No screenshots, no business data, no brand logos.
// Translatable copy: messages → content.projects.<id> (title, context, role, summary, highlights[]).

export type ProjectId = "nexplan" | "iap" | "financial";

export type Project = {
  id: ProjectId;
  period: DateRange | null;
  stack: string[];
};

export const projects: Project[] = [
  {
    id: "nexplan",
    period: { start: { year: 2024 }, end: null },
    // TODO: confirm the full NexPlan frontend stack (React? TypeScript?). Only what the brief states is listed.
    stack: ["styled-components", ".NET"],
  },
  {
    id: "iap",
    // TODO: add the IAP project period (start and end).
    period: null,
    stack: ["React", "MUI", ".NET (BFF)", "Figma", "Azure"],
  },
  {
    id: "financial",
    // TODO: add the period for the financial-sector work (Banco Galicia, Itaú, Macro).
    period: null,
    stack: ["React", "TypeScript", "Next.js", "Jest"],
  },
];

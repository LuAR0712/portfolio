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
    stack: ["React", "TypeScript", "styled-components", ".NET"],
  },
  {
    id: "iap",
    period: { start: { year: 2023 }, end: { year: 2024 } },
    stack: ["React", "MUI", ".NET (BFF)", "Figma", "Azure"],
  },
  {
    id: "financial",
    period: { start: { year: 2022, month: 12 }, end: { year: 2024 } },
    stack: ["React", "TypeScript", "Next.js", "Jest"],
  },
];

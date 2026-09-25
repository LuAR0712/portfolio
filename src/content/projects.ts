import type { DateRange } from "@/lib/dates";
import { tech, type Tech } from "./tech";

// Client projects are internal systems: described by technical challenge and role only.
// No screenshots, no business data, no brand logos.
// Translatable copy: messages → content.projects.<id> (title, context, role, summary, highlights[]).

export type ProjectId = "nexplan" | "iap" | "financial";

export type Project = {
  id: ProjectId;
  period: DateRange | null;
  stack: Tech[];
};

export const projects: Project[] = [
  {
    id: "nexplan",
    period: { start: { year: 2024 }, end: null },
    stack: [tech.react, tech.typescript, tech.styledComponents, tech.dotnet],
  },
  {
    id: "iap",
    period: { start: { year: 2023 }, end: { year: 2024 } },
    stack: [tech.react, tech.mui, tech.dotnetBff, tech.figma, tech.azure],
  },
  {
    id: "financial",
    period: { start: { year: 2022, month: 12 }, end: { year: 2024 } },
    stack: [tech.react, tech.typescript, tech.nextjs, tech.jest],
  },
];

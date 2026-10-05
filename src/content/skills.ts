import { tech, type Tech } from "./tech";

// Skills are a typographic list grouped by category: no levels, bars or ratings.
// Logos are monochrome and secondary to the name (see TechIcon).
// Translatable copy: messages → content.skills.categories.<id> and content.skills.notes.<note>.

export type SkillCategoryId =
  "languages" | "frontend" | "mobile" | "testing" | "design" | "platform" | "tools";
export type SkillNote = "theming" | "deployments" | "learning";

export type Skill = Tech & { note?: SkillNote };

export type SkillCategory = { id: SkillCategoryId; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  { id: "languages", skills: [tech.javascript, tech.typescript, tech.html, tech.css, tech.dart] },
  {
    id: "frontend",
    skills: [tech.react, tech.nextjs, { ...tech.mui, note: "theming" }, tech.styledComponents],
  },
  { id: "mobile", skills: [tech.reactNative, tech.flutter] },
  { id: "testing", skills: [tech.jest] },
  { id: "design", skills: [tech.figma] },
  {
    id: "platform",
    skills: [
      { ...tech.azure, note: "deployments" },
      { ...tech.dotnetCsharp, note: "learning" },
    ],
  },
  { id: "tools", skills: [tech.git, tech.githubCopilot, tech.claudeCode] },
];

// Skills are a typographic list grouped by category: no levels, bars or ratings.
// Translatable copy: messages → content.skills.categories.<id> and content.skills.notes.<note>.

export type SkillCategoryId =
  "languages" | "frontend" | "testing" | "design" | "platform" | "tools";
export type SkillNote = "theming" | "deployments" | "learning";

export type Skill = { name: string; note?: SkillNote };

export type SkillCategory = { id: SkillCategoryId; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    skills: [{ name: "JavaScript" }, { name: "TypeScript" }, { name: "HTML" }, { name: "CSS" }],
  },
  {
    id: "frontend",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "MUI", note: "theming" },
      { name: "styled-components" },
    ],
  },
  { id: "testing", skills: [{ name: "Jest" }] },
  { id: "design", skills: [{ name: "Figma" }] },
  {
    id: "platform",
    skills: [
      { name: "Azure", note: "deployments" },
      { name: ".NET / C#", note: "learning" },
    ],
  },
  {
    id: "tools",
    skills: [{ name: "Git" }, { name: "GitHub Copilot" }, { name: "Claude Code" }],
  },
];

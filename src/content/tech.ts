import type { TechIconId } from "@/lib/tech-icons";

// Single catalog of technologies, shared by the skills list and each project's stack.
// `icon` is omitted where no logo is available (see lib/tech-icons.ts).
export type Tech = { name: string; icon?: TechIconId };

export const tech = {
  javascript: { name: "JavaScript", icon: "javascript" },
  typescript: { name: "TypeScript", icon: "typescript" },
  html: { name: "HTML", icon: "html" },
  css: { name: "CSS", icon: "css" },
  react: { name: "React", icon: "react" },
  nextjs: { name: "Next.js", icon: "nextjs" },
  mui: { name: "MUI", icon: "mui" },
  styledComponents: { name: "styled-components", icon: "styledComponents" },
  jest: { name: "Jest", icon: "jest" },
  figma: { name: "Figma", icon: "figma" },
  azure: { name: "Azure" },
  dotnet: { name: ".NET", icon: "dotnet" },
  dotnetCsharp: { name: ".NET / C#", icon: "dotnet" },
  dotnetBff: { name: ".NET (BFF)", icon: "dotnet" },
  git: { name: "Git", icon: "git" },
  githubCopilot: { name: "GitHub Copilot", icon: "githubCopilot" },
  claudeCode: { name: "Claude Code", icon: "claude" },
} as const satisfies Record<string, Tech>;

# Engineering conventions

Personal portfolio of Luciano Rossi (Frontend Developer). Bilingual (`/es`, `/en`), light/dark, deployed on Vercel.
These conventions are the source of truth for how the repo is built. If code and this document disagree, fix one of them in the same PR.

## Stack (versions verified against npm on 2026-09-24)

| Area               | Choice                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Framework          | Next.js 16.3 (App Router) + React 19.3                                                                                                |
| Language           | TypeScript 6.0 (`strict`). **Not 7.x**: `typescript-eslint` supports `<6.1.0`                                                         |
| Styling            | Tailwind CSS 4.3, CSS-first config (`@theme`), design tokens as CSS variables                                                         |
| Animation          | `motion` 13 — import from `motion/react`, never `framer-motion`                                                                       |
| i18n               | `next-intl` 4 with locale routing (`proxy.ts`, Next 16 name for middleware)                                                           |
| Theme              | `next-themes` (`attribute="data-theme"`, default `system`)                                                                            |
| Forms              | `react-hook-form` 7 + `zod` 4 via `@hookform/resolvers`                                                                               |
| Email / rate limit | `resend`, `@upstash/ratelimit` + `@upstash/redis` (in-memory fallback)                                                                |
| Tests              | Vitest 5 + React Testing Library + jsdom, `axe-core` for a11y assertions                                                              |
| Lint / format      | ESLint 9 (flat config, `eslint-config-next`) — **not 10.x** until Next's plugins support it; Prettier + `prettier-plugin-tailwindcss` |
| Package manager    | npm. Node 22 LTS                                                                                                                      |

Dependencies are pinned to exact versions. Before adding or upgrading one, check its latest version and peer dependencies (`npm view <pkg> version peerDependencies`).

## Commands

```bash
npm run dev         # local dev server
npm run build       # production build
npm run start       # serve production build
npm run lint        # ESLint, zero warnings allowed
npm run typecheck   # next typegen + tsc --noEmit
npm test            # Vitest (run once)
npm run test:watch  # Vitest watch mode
npm run format      # Prettier write
npm run format:check # Prettier check (CI)
```

CI runs `lint`, `typecheck`, `test` and `build` on every push. All four must pass before merging.

## Folder structure

```
src/
  app/[locale]/        layout.tsx, page.tsx, opengraph-image.tsx
  app/                 sitemap.ts, robots.ts
  components/ui/       primitives: Container, Section, ButtonLink (+ button-styles), Icon, DateRangeText
  components/layout/   Header, Footer, SkipLink, MobileNav, LanguageSwitcher, ThemeToggle, ThemeProvider, ScrollProgress
  components/sections/ Hero, About, Experience, Projects, Skills, Education, Contact
  features/contact/    schema, server action, form components, tests (self-contained feature)
  content/             typed data: experience, projects, skills, education, profile
  i18n/                routing.ts, request.ts, navigation.ts
  lib/                 utils, dates (partial dates), motion.ts (animation variants), env.ts (validated env), constants
  hooks/               custom hooks
  styles/              globals.css (tokens, base layers)
  test/                shared test helpers (renderWithIntl, expectNoAxeViolations)
  proxy.ts             next-intl locale detection
  global.d.ts          next-intl type augmentation (typed message keys)
messages/es.json, messages/en.json, messages.test.ts (key parity)
public/cv/             luciano-rossi-cv-es.pdf, luciano-rossi-cv-en.pdf
```

## Architecture rules

1. **Content lives in `src/content/`** as typed TS objects. Components render data; they never own it.
   Non-translatable data (dates, stack, ids, URLs) stays in TS; translatable text lives in `messages/*.json` under `content.<entity>.<id>` and is referenced by key.
2. **No visible hardcoded strings in components.** Every user-facing string (including `aria-label`, `alt`, error messages) comes from `messages/*.json`. A hardcoded string is a bug.
3. `es.json` and `en.json` must always have identical key sets (enforced by a test).
4. **Server Components by default.** `"use client"` only for animation wrappers, toggles and the contact form. Keep client islands small and push them to the leaves.
5. **Animation variants live in `src/lib/motion.ts`.** Sections import variants; they don't define their own.
6. Environment variables are read only through `src/lib/env.ts` (zod-validated). Never `process.env.X` elsewhere.
7. The contact zod schema is shared between client and server. The server never trusts the client.
8. Missing real data → leave a visible `TODO:` comment in the content file. Never invent data.
9. Never publish the phone number anywhere in the site. It only goes in the PDF CV.
10. Client projects (YPF, banks) are described by technical challenge and role only: no screenshots, no business data, no brand logos.

## Naming conventions

- Components: `PascalCase.tsx`, one component per file, named export (`export function Hero`). Default exports only where Next requires them (`page`, `layout`, `opengraph-image`, etc.).
- Hooks: `useCamelCase.ts` in `src/hooks/` (or inside the feature that owns them).
- Utilities, content and config files: `kebab-case.ts` / `camelCase` exports.
- Types: `PascalCase`, colocated with their data (`content/projects.ts` exports `Project`). Prefer `type` over `interface` unless extending.
- Tests: `*.test.ts(x)` next to the file under test.
- Translation keys: `camelCase`, namespaced by section (`hero.headline`, `contact.errors.nameTooShort`).
- CSS tokens: `--color-brand-500`, `--color-bg`, `--text-h2`, `--space-section`.

## Design criteria

- **Palette as tokens only.** Scales `brand` (deep blue), `accent` (cyan, interactive/focus only) and `ink` (blue-tinted greys), 50–950. Semantic tokens (`--color-bg`, `--color-surface`, `--color-fg`, `--color-muted`, `--color-border`, `--color-primary`, `--color-primary-fg`, `--color-focus`) are redefined per theme under `[data-theme="dark"]`. Tailwind's default palette is disabled (`--color-*: initial`), so only token colors exist. No raw hex/rgb in components, no arbitrary Tailwind colors.
- **Two themes designed separately**, not inverted: own gradients, shadows and contrast per theme. Dark mode backgrounds are subtle, never neon.
- **Backgrounds**: CSS radial/mesh gradients + faint SVG noise grain. No background images.
- **Typography**: Bricolage Grotesque (headings, tight tracking) + Inter (body), via `next/font`. Max two families. Fluid scale with `clamp()`. Section titles carry real visual weight.
- **Layout**: max content width ~72rem, 12-column grid, generous and regular vertical rhythm (`--space-section`). Don't fill the full width.
- **Avoid template look**: no stacks of identical rounded cards, no colored tech-icon grids, no progress bars or star ratings for skills. Skills are typographic lists grouped by category.
- **Motion communicates hierarchy or state, never itself.** Content animations ≤600 ms, only `transform`/`opacity` (no CLS), no artificial loaders. Every animated component honors `useReducedMotion`.
- **Accessibility is a requirement**: full keyboard navigation, visible high-contrast focus, semantic landmarks, WCAG AA contrast in both themes (enforced for semantic pairs by `src/styles/tokens.test.ts` — add new pairs there), responsive from 320px.
- Performance target: Lighthouse ≥95 in all four categories on a production build.

## Git

- Atomic commits, English, [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`, `style:`, `ci:`, `perf:`. Optional scope: `feat(contact): ...`.
- One logical change per commit. Don't mix tooling, content and features.

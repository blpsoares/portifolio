---
name: update-profile
description: Update Bryan's portfolio content (CV, career, projects, education, skills) keeping PT/EN, the on-page sections, the generated CV PDF, and the AI assistant's knowledge all in sync. Use when the user wants to add/edit a job, project, skill, or any CV/profile info.
---

# Update Profile

All of Bryan's profile / CV data now lives in **ONE place**:

> **`src/data/profile.ts`**

Edit that file and everything derives from it automatically:

- the on-page sections (career, projects, education, tech arsenal, low-code, MCP),
- both locales (`pt` / `en`) in `src/i18n/pt.ts` and `src/i18n/en.ts`,
- the generated **CV PDF** (`src/utils/generateCv.ts`),
- the **AI assistant's knowledge** (`functions/api/_context.ts`).

You should **not** need to touch `src/i18n/*.ts`, `src/constants.tsx`, or
`functions/api/_context.ts` for a content change — they only re-map values out of
`profile.ts`.

## How `profile.ts` is structured

It exports a single `profile` object. Bilingual text uses the `I18nText` shape
`{ pt: "...", en: "..." }`; language-neutral values are plain strings.

| What you want to change | Edit in `profile.ts` |
| --- | --- |
| Contact / name / title / location | `personal` |
| CV summary | `summary` (bilingual) |
| A job (on page **and** CV PDF) | `experience[]` — `role`, `company`, `period`, `duration`, `type`, `location`, `current`, `bullets[]` (each bilingual), and `cvTech` (the tech line under the role in the PDF) |
| On-page work projects | `workProjects[]` — bilingual `title`/`category`/`description` (used on the page) + `cardTitle`/`cardCategory`/`cardDescription`/`technologies` (the `PROJECTS` card) |
| CV PDF projects (Agentistics, DuckFlux, …) | `cvProjects[]` (distinct from the on-page work projects) |
| Education | `education[]` |
| CV PDF skill groups | `cvSkills[]` (distinct from the on-page Tech Arsenal) |
| On-page Tech Arsenal | `techStack[]` |
| Low-code cards | `lowCodeTools[]` (icon + bilingual description) |
| MCP cards | `mcpWorkflows[]` (icon + bilingual description) |
| Languages | `languages` (bilingual) |

Notes:
- The CV PDF projects/skills are **intentionally different** from the on-page
  work projects / Tech Arsenal — both sets live in `profile.ts`. Keep both.
- Set `current: true` only on the newest job; flip the previous one to `false`.
- Static UI labels (section headings, `techLabel`, nav, hero, about, etc.) are
  NOT profile data — they stay as plain strings in `src/i18n/pt.ts` / `en.ts`.

## After editing

Run **`bun run build`** and fix any TypeScript errors. The shapes are typed, so
the build will catch a missing `pt`/`en` side or a wrong field.

## Final checklist

- [ ] Edited `src/data/profile.ts` only (kept both `pt` and `en` sides of any `I18nText`).
- [ ] If it's a job, updated its `bullets` and `cvTech`; for a headline change also adjust `summary`.
- [ ] `bun run build` passes.

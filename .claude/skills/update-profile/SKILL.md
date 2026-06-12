---
name: update-profile
description: Update Bryan's portfolio content (CV, career, projects, education, skills) keeping PT/EN, the on-page sections, the generated CV PDF, and the AI assistant's knowledge all in sync. Use when the user wants to add/edit a job, project, skill, or any CV/profile info.
---

# Update Profile

The portfolio's content lives in a few places. When the user updates ANY profile
info, you must keep **all relevant sources in sync** — especially both locales
(`pt` and `en`) and the AI's knowledge file.

## Where each piece of data lives

| Content | File(s) | Key |
| --- | --- | --- |
| **CV / PDF** (name, contact, summary, experience, projects, skills, education, languages) | `src/i18n/pt.ts` **and** `src/i18n/en.ts` | `cv` |
| **Career timeline** (on page) | `src/i18n/pt.ts` + `src/i18n/en.ts` | `career.items[]` |
| **Projects** (on-page text) | `src/i18n/pt.ts` + `src/i18n/en.ts` | `projects.items[]` |
| **Projects** (technologies / structure) | `src/constants.tsx` | `PROJECTS` |
| **Education** | `src/i18n/pt.ts` + `src/i18n/en.ts` | `education.items[]` |
| **Skills / tech stack** | `src/constants.tsx` | `SKILLS` (+ `t.techstack.categories` labels) |
| **Low-code / MCP cards** | `src/constants.tsx` (+ i18n descriptions) | `LOW_CODE_TOOLS`, `MCP_WORKFLOWS`, `mcp.descriptions`, `lowcode.descriptions` |
| **Hero / About / Who-I-am copy** | `src/i18n/pt.ts` + `src/i18n/en.ts` | `hero`, `whoiam`, `about` |
| **🤖 AI assistant's knowledge** | `functions/api/_context.ts` | `CV_CONTEXT` |

## Golden rules

1. **Always edit BOTH `pt.ts` and `en.ts`.** Keys must stay identical across
   locales; only the text differs (Portuguese vs English). Never add a key to one
   without the other — it breaks the build/UX.
2. **The CV PDF = the `cv` block.** Changing a job in `career.items` does NOT
   change the PDF; update `cv.tech` / `cv.projects` / `cv.skills` too if relevant.
3. **Update `functions/api/_context.ts` (`CV_CONTEXT`).** This is what the real
   AI (`bra.ia`) cites. If you skip it, the assistant answers with stale info.
   It's plain English prose — mirror the change there concisely.
4. After edits, run **`bun run build`** and fix any TypeScript errors. Keep the
   shape of existing objects (same fields).

## Typical tasks

### Add or edit a job
- `career.items[]` in `pt.ts` **and** `en.ts` (role, company, period, duration,
  type, location, current, bullets[]). Set `current: true` only on the newest;
  set the previous current one to `false`.
- If it changes the headline experience, update `cv.summary`, `cv.tech`, and
  `CV_CONTEXT` (EXPERIENCE section) accordingly.

### Add a project
- `PROJECTS` in `src/constants.tsx` (technologies + order).
- `projects.items[]` in `pt.ts` + `en.ts` (title, category, description) — keep
  the array length aligned with `PROJECTS`.
- Mention it in `CV_CONTEXT` (KEY PROJECTS) if notable.

### Add a skill / tech
- `SKILLS` in `src/constants.tsx` (under the right category).
- If it's a headline AI/backend skill, add to `cv.skills` (pt+en) and
  `CV_CONTEXT` (SKILLS).

### Update contact / education / summary
- `cv` block (pt+en) for contact/summary; `education.items[]` (pt+en) for studies.
- Reflect in `CV_CONTEXT`.

## Final checklist before finishing
- [ ] Edited both `pt.ts` and `en.ts` (keys identical).
- [ ] Updated `cv` block if it affects the PDF.
- [ ] Updated `src/constants.tsx` if structure/skills/tech changed.
- [ ] Updated `functions/api/_context.ts` `CV_CONTEXT` so the AI stays current.
- [ ] `bun run build` passes.
- [ ] Committed and pushed.

# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js 16 prototype for a Harmonies score-sheet app. App Router files live in `src/app`; reusable UI belongs in `src/components`; shared domain types belong in `src/types`. Token art is stored in `src/assets`, and the rules PDF lives in `public/`.

Prefer the `@/*` alias for imports from `src`, for example `@/components` and `@/types`.

## Domain Rules To Preserve
Model changes must stay aligned with `https://www.geekyhobbies.com/harmonies-rules/`. The app is about tracking landscapes, habitats, and animal scoring, not generic counters.

Key rules to preserve:
- A turn always includes taking exactly 3 tokens from one central-board slot and placing all 3.
- Only legal stacks are allowed: mountains are 1-3 gray; trees are green on 0-2 brown; buildings are red on brown, gray, or red.
- Animal cards create habitats that must match exactly, but may be rotated.
- A player may hold at most 4 active animal or Nature's Spirit cards.
- Scoring differs by board side: Side A scores the best river; Side B scores islands.

If you add scoring logic, keep landscape points and animal-card points separate.

## Build, Test, and Development Commands
- `pnpm dev`: run the app locally at `http://localhost:3000`.
- `pnpm build`: create the production build.
- `pnpm start`: serve the production build.
- `pnpm lint`: run ESLint with Next.js and TypeScript rules.

Use `pnpm`; `pnpm-lock.yaml` is committed.

## Coding Style & Naming Conventions
Use strict TypeScript, 2-space indentation, and functional React components. Components and exported types use PascalCase, while props and locals use camelCase. Keep game terms explicit in names, such as `TokenKind`, `AnimalCard`, or `HabitatPattern`.

Avoid vague names like `item`, `data`, or `value` when the domain term is known from the rules.

## Testing Guidelines
There is no test runner configured yet. Before opening a PR, run `pnpm lint` and manually verify the affected flow in `pnpm dev`.

When tests are added, place them next to the feature or under `src/__tests__` using `*.test.ts` or `*.test.tsx`. Prioritize coverage for stacking validation, habitat matching, turn constraints, and side-specific scoring.

## Commit & Pull Request Guidelines
Recent commits use short, imperative subjects, with emojis, for example `✨ implement PointDashboard`. Keep commits focused and easy to review.

PRs should include a description, manual verification steps, and screenshots for UI changes. Call out any rule interpretation taken from the PDF, especially for scoring or placement edge cases.

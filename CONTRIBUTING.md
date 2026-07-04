# Contributing Guide

Thanks for your interest in contributing to **Harmonies Points**! This guide explains how to propose changes so they are easy to review and respect the game's rules.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or higher.
- [pnpm](https://pnpm.io/) 11 (the version is pinned in `package.json`). The `pnpm-lock.yaml` is committed; always use `pnpm`.

## Getting started

```bash
# 1. Clone your fork
git clone https://github.com/<your-username>/harmonies-scoresheet.git
cd harmonies-scoresheet

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

The app is available at `http://localhost:3000`.

Useful commands:

- `pnpm dev`: development server.
- `pnpm build`: production build.
- `pnpm start`: serve the production build.
- `pnpm lint`: ESLint with Next.js and TypeScript rules.

## Workflow

1. Create a branch from the latest version of the main branch:

   ```bash
   git checkout -b feat/short-description
   ```

2. Make your changes in small, focused commits.
3. Before opening the PR, make sure everything passes:

   ```bash
   pnpm lint
   pnpm build
   ```

4. Manually verify the affected flow with `pnpm dev`.
5. Open a Pull Request against the main branch.

## Project structure

```text
src/
  app/          App Router and global styles
  components/   reusable score-sheet UI
  i18n/         configuration and translations (es, en, fr)
  lib/          scoring logic and initial state
  types/        domain types and scoring contracts
  assets/       token art and branding
public/         public assets
```

## Code style

- Strict TypeScript, 2-space indentation, and functional React components.
- Components and exported types use `PascalCase`; props and locals use `camelCase`.
- Prefer the `@/*` alias for imports, e.g. `@/components` and `@/types`.
- Use explicit domain names (`TokenKind`, `AnimalCard`, `HabitatPattern`) instead of vague names like `item`, `data`, or `value`.
- If you add user-facing text, add the translations in `src/i18n/locales/{es,en,fr}/translation.json`.

## Domain rules to preserve

Model changes must stay aligned with the [official Harmonies rules](https://www.geekyhobbies.com/harmonies-rules/):

- A turn always includes taking exactly 3 tokens from one central-board slot and placing all 3.
- Only legal stacks are allowed: mountains are 1-3 gray; trees are green on 0-2 brown; buildings are red on brown, gray, or red.
- Animal cards create habitats that must match exactly, but may be rotated.
- A player may hold at most 4 active animal or Nature's Spirit cards.
- Scoring differs by board side: Side A scores the best river; Side B scores islands.
- Keep landscape points and animal-card points separate.

## Commits and Pull Requests

- Use short, imperative commit messages (emojis are welcome), e.g. `✨ implement PointDashboard` or `🐛 fix island scoring`.
- Keep each commit focused and easy to review.
- In the PR, include:
  - A clear description of the change.
  - Manual verification steps.
  - Screenshots for UI changes.
  - Any rule interpretation taken from the PDF, especially for scoring or placement edge cases.

## Reporting bugs or proposing ideas

Open an issue in the repository with:

- Steps to reproduce the problem (or the improvement proposal).
- Expected behavior and current behavior.
- Screenshots or environment details if applicable.

Thanks for contributing!

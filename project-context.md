# EV21 - Project Context & AI Rules

This document serves as the absolute source of truth for all BMad agents and developers collaborating on this project. Agents MUST read and adhere strictly to these conventions before executing tasks.

## 🎯 Core Identity
- **Project Name**: EV21
- **Domain**: Premium Open-Source Blackjack & Probability Simulator

## ⚙️ Development Workflows & Conventions (MANDATORY)

### 1. Gitflow Methodology
All BMad agents MUST strictly adhere to the Gitflow workflow when implementing stories or issues:
- `main` is strictly reserved for stable production code. No direct commits allowed.
- `develop` is the active development integration branch.
- **Workflow for Stories/Issues:**
  1. ALWAYS branch off `develop` before writing any code.
  2. The branch naming convention is: `feature/story-[number]-[brief-name]` or `fix/issue-[number]`.
     *(Example: `git checkout -b feature/story-1.2-card-rendering develop`)*
  3. Work is performed and committed on this feature branch.
  4. (MANDATORY) At the end of the dev and test pipeline, you must push your branch and open a Merge Request (Pull Request) on GitHub targeting `develop`. You MUST link the corresponding GitHub Issue in the MR description (e.g. by adding "Resolves #X") to track progress.

### 2. Semantic Versioning (SemVer) & Conventional Commits
- The project strictly follows Semantic Versioning for releases.
- **ALL commits MUST follow the Conventional Commits specification:**
  - Format: `<type>[optional scope]: <description>`
  - Types allowed: `feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`, `test:`
  - *Example: `feat(ui): implement 3D card flip animation`*

## 🏗️ Architecture & Tech Stack
- **Framework**: Nuxt 4 (Vue 3)
- **Styling**: Tailwind CSS v4. 
  - *CRITICAL RULE*: Do NOT use layout components from Nuxt UI Pro (no `<UHeader>`, no `<UFooter>`). Use pure semantic HTML (`<header>`, `<footer>`) with Tailwind utility classes to ensure SSR safety and prevent Vite IPC crashes.
- **State Management**: Pinia (Modules: useGameStore, useEconomyStore, useConfigStore)
- **Testing**: Playwright for E2E, Vitest for Unit tests.

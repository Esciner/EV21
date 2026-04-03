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
  4. (Optional) Create a Pull Request to merge back into `develop` when the story is complete.

### 2. Semantic Versioning (SemVer) & Conventional Commits
- The project strictly follows Semantic Versioning for releases.
- **ALL commits MUST follow the Conventional Commits specification:**
  - Format: `<type>[optional scope]: <description>`
  - Types allowed: `feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`, `test:`
  - *Example: `feat(ui): implement 3D card flip animation`*

### 3. AI Agent Workflow Process (AI-Native TDD Pipeline)
To ensure maximum quality, consistency, and zero regressions, this project strictly enforces an **AI-Native Test-Driven Development (TDD) and Acceptance Test-Driven Development (ATDD)** pipeline. Feature implementation MUST follow this sequence carefully:

1. **Phase 1: Architecture & UX Specs**: Launch a Design/Architecture Agent (e.g., `bmad-agent-ux-designer` or `bmad-agent-architect`) to finalize the feature's specifications, components, and technical boundaries.
2. **Phase 2: Test-Driven Design (RED)**: Launch a Test Architect/QA Agent (e.g., `bmad-tea` or `bmad-testarch-atdd`) to write failing Unit, API, and E2E tests based on the approved specifications. Do NOT write application code yet.
3. **Phase 3: Development (GREEN)**: Launch a Development Agent (e.g., `bmad-agent-dev` or `bmad-quick-dev`) and instruct them to write the minimum code necessary to make the tests pass. If the development agent needs to change the tests, they must explain why.
4. **Phase 4: Refactor, Code Review & Coverage (REFACTOR)**: Launch a QA or Review Agent (e.g., `bmad-code-review` or `bmad-agent-qa`) to look for edge cases (`bmad-review-edge-case-hunter`), optimize the system, refactor the application, and ensure 100% test coverage.

## 🏗️ Architecture & Tech Stack
- **Framework**: Nuxt 4 (Vue 3)
- **Styling**: Tailwind CSS v4. 
  - *CRITICAL RULE*: Do NOT use layout components from Nuxt UI Pro (no `<UHeader>`, no `<UFooter>`). Use pure semantic HTML (`<header>`, `<footer>`) with Tailwind utility classes to ensure SSR safety and prevent Vite IPC crashes.
- **State Management**: Pinia (Modules: useGameStore, useEconomyStore, useConfigStore)
- **Testing**: Playwright for E2E, Vitest for Unit tests.

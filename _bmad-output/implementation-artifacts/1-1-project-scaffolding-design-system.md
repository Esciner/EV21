# Story 1.1: Project Scaffolding & Design System

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the Nuxt 4 project initialized with all required modules and the casino design system configured,
so that all subsequent stories have a working foundation.

## Acceptance Criteria

1. **Given** no project exists, **When** the initialization commands are run (`npx nuxi@latest init . -t ui` in the destination directory, plus Pinia, VueUse, Vitest), **Then** the project builds and runs with `npm run dev`.
2. **Given** UI configuration, **Then** Tailwind CSS is configured with casino design tokens (felt-green `#0C3B2E`, gold `#D4AF37`, ivory palette `#FFFDD0`).
3. **Given** typography needs, **Then** Inter font is loaded from Google Fonts and JetBrains Mono (or Space Mono) is loaded for game numbers.
4. **Given** game logic requirements, **Then** the `app/types/game.ts` file defines the GamePhase enum (`IDLE`, `BETTING`, `DEALING`, `PLAYER_TURN`, `EV_FEEDBACK`, `DEALER_TURN`, `RESOLVING`, `PAYOUT`), Card, Hand, and Suit types.
5. **Given** state management needs, **Then** the 4 Pinia store files are scaffolded (useGameStore, useEconomyStore, useSettingsStore, useConfigStore).
6. **Given** config needs, **Then** `public/config/game-config.json` exists with all default parameter values.
7. **Given** routing needs, **Then** the game page (`app/pages/game.vue`) is configured with `ssr: false` and the landing page (`app/pages/index.vue`) renders with SSG.

## Developer Context & Guardrails (CRITICAL)

### Technical & Architecture Requirements
- **Framework:** Nuxt 4.4.x (Vue 3, TypeScript native) + Nitro. Use `npx nuxi@latest init . -t ui` exactly (or adapt to current folder).
- **Styling:** Nuxt-UI v3 + Tailwind CSS v4.
  - Define custom colors in `.css`: `felt-green` (#0C3B2E), `gold` (#D4AF37), `ivory` (#FFFDD0).
  - Define semantic colors: `ev-positive` (#22C55E), `ev-negative` (#EF4444), `ev-neutral` (#F59E0B).
  - **Layout Rule:** Do NOT use `@nuxt/ui-pro` components like `<UHeader>` or `<UFooter>`. Use standard semantic HTML tags (`<header>`, `<footer>`) styled with Tailwind classes (e.g. `bg-slate-950/80 backdrop-blur`) and Nuxt UI `UContainer` to ensure SSR stability and layout consistency.
- **Libraries required:**
  - `@pinia/nuxt` (Pinia v3.x)
  - `@vueuse/nuxt` (latest)
  - `@nuxtjs/i18n` (latest)
  - `vitest` (for co-located unit tests)
- **State Management Restrictions:**
  - Strictly 4 stores. Ephemeral state in `useGameStore`. Persisted state in `useEconomyStore` and `useSettingsStore` (using `useLocalStorage`). Read-only config in `useConfigStore`.
  - **Rule:** Composables MUST NEVER import a store. Stores MUST NEVER import a component.
- **Default Config (`public/config/game-config.json`):**
  ```json
  {
    "startingBalance": 1000,
    "levelEntryFee": 500,
    "levelUpThreshold": 1500,
    "evBonusMultiplier": 1.5,
    "level1AiErrorRate": 0.4,
    "rehabPayoutCap": 500
  }
  ```

### File Structure Requirements
You must adhere EXACTLY to this project structure. Do not invent arbitrary folders.
```text
app/
├── pages/
│   ├── index.vue       # Landing page (SSG, SEO)
│   └── game.vue        # Game engine (SPA, ssr: false)
├── components/
│   ├── game/           # Custom Vue components (no Nuxt-UI here)
│   └── ui/             # Wraps Nuxt-UI components
├── composables/        # Pure logic, no side-effects
├── stores/             # Pinia stores 
│   ├── useGameStore.ts
│   ├── useEconomyStore.ts
│   ├── useSettingsStore.ts
│   └── useConfigStore.ts
├── types/
│   └── game.ts         # GamePhase enum, Card, Hand types
├── locales/            # i18n
│   ├── fr.json         # default
│   ├── nl.json
│   ├── en.json
│   └── de.json
public/
└── config/
    └── game-config.json
```

### Anti-Patterns to Prevent
- **DO NOT** use `__tests__` directories. Tests must be co-located (e.g., `useGameStore.test.ts` next to `useGameStore.ts`).
- **DO NOT** use TypeScript `any`.
- **DO NOT** use hardcoded strings for UI text. Use `$t()` from `@nuxtjs/i18n` (even if generating empty placeholders in `fr.json` for now).
- **DO NOT** use a Web Worker for EV calculations or complex state machine libraries like XState. Use a simple TypeScript enum `GamePhase`.
- **DO NOT** mix component logic. `components/game/` is strictly for bespoke Vue+Tailwind components, `components/ui/` is for structural UI elements leveraging Nuxt-UI.

## Tasks / Subtasks

- [ ] Task 1: Project Initialization & Dependencies (AC: 1, 3)
  - [ ] Initialize the nuxt project with Nuxt UI.
  - [ ] Install missing modules: `@pinia/nuxt`, `@vueuse/nuxt`, `@nuxtjs/i18n`, `vitest`.
  - [ ] Configure `nuxt.config.ts` to load these modules and setup Google Fonts (Inter, JetBrains Mono).
- [ ] Task 2: Structural Scaffolding & Routing (AC: 7)
  - [ ] Create `app/pages/index.vue`.
  - [ ] Create `app/pages/game.vue` and set `defineRouteRules({ ssr: false })` or configure it in `nuxt.config.ts` so game is SPA and index is SSG.
- [ ] Task 3: Design Tokens & Styling (AC: 2)
  - [ ] Configure the theme tokens with `felt-green`, `gold`, `ivory`, and semantic `ev-*` colors.
- [ ] Task 4: Types & Enums (AC: 4)
  - [ ] Create `app/types/game.ts` and define `GamePhase`, `Card`, `Hand`, `Suit`.
- [ ] Task 5: State & Config Scaffolding (AC: 5, 6)
  - [ ] Create the 4 Pinia store files with basic scaffolding.
  - [ ] Create `public/config/game-config.json` with required keys.
  - [ ] Setup `app/locales/` directory with empty `fr.json`, `nl.json`, `en.json`, `de.json` files and configure i18n module with `fr` as default.

### Development Guidelines Reference
- [Source: planning-artifacts/architecture.md#Implementation-Patterns-Consistency-Rules]
- [Source: planning-artifacts/ux-design-specification.md#Design-System-Foundation]

## Dev Agent Record

Ultimate context engine analysis completed - comprehensive developer guide created.

### Review Findings

- [x] [Review][Patch] Nuxt 4 Compliance: Folder structure alignment [nuxt.config.ts:32]
- [x] [Review][Patch] Sync Lockfile: Downgrade coordination [package.json:29]
- [x] [Review][Patch] Config Validation: Add JSON schema check [app/stores/useConfigStore.ts:1]
- [x] [Review][Patch] Type Safety: Replace 'as any' casting [app/pages/game.vue:38]
- [x] [Review][Patch] Reset Methods: Add clearing logic to stores [app/stores/:1]
- [x] [Review][Patch] Font Performance: Move @import to config [app/assets/css/main.css:1]
- [x] [Review][Patch] Persistence Safety: Add try/catch to localStorage [app/stores/useEconomyStore.ts:1]
- [x] [Review][Patch] Loading Race: Fix async init state [app/pages/game.vue:15]
- [x] [Review][Defer] Numerical Precision: Native Numbers chosen — deferred, pre-existing
- [x] [Review][Defer] Dev Port Handling: Static 3000 for local env — deferred, pre-existing
- [x] [Review][Defer] i18n Fallback: Handled when adding locales — deferred, pre-existing
- [x] [Review][Defer] Store Testing: Unit tests in next story — deferred, pre-existing

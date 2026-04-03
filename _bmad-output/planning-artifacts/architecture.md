---
stepsCompleted: [step-01-init, step-02-context, step-03-starter, step-04-decisions, step-05-patterns, step-06-structure, step-07-validation, step-08-complete]
lastStep: 8
status: 'complete'
completedAt: '2026-04-01T20:33:00'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/product-brief-bmad-test.md
workflowType: 'architecture'
project_name: 'bmad-test'
user_name: 'Esciner'
date: '2026-04-01T20:06:00'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
21 FRs organized into 7 domains:
- **Game Session Execution (FR1-FR4):** Standard 52-card Blackjack engine with configurable dealer behavior profiles (standard rules vs. intentional errors for Level 1). Supports Hit, Stand, Double only (no Split/Insurance/Surrender in MVP).
- **EV & Pedagogy System (FR5-FR8):** Real-time Expected Value computation for all player actions based on visible cards. Flags sub-optimal moves, renders educational feedback, and issues bonus virtual currency for mathematically optimal decisions regardless of hand outcome.
- **Onboarding & Compliance (FR15-FR16):** Guided first-3-hands onboarding woven into gameplay. Persistent educational disclaimer.
- **Dynamic Player Economy (FR9-FR12):** localStorage-persisted virtual currency. Sequential level gating (Level 1 → Level 2). Automatic bankrupt detection with "Back to Basics" rehabilitation loop. Capped payouts in rehabilitation mode.
- **Game Administration (FR17-FR18):** Dynamic configuration of AI error rates, starting cash, EV bonus amounts, and level entry fees via JSON/config without redeployment.

**Non-Functional Requirements:**
- **NFR1:** EV calculations resolve in <50ms
- **NFR2:** 60 FPS animations on baseline mobile (iPhone 11)
- **NFR3:** Time-to-Interactive <2.5s on 4G
- **NFR4:** 4.5:1 minimum contrast ratio (WCAG AA)
- **NFR5:** Full keyboard accessibility for core actions (Tab, Space, Enter)
- **NFR6:** Instant localStorage commit on hand resolution (crash resilience)

**Scale & Complexity:**
- Primary domain: Full-stack Frontend (NuxtJS SPA + SSR landing pages)
- Complexity level: Medium
- Estimated architectural components: ~12-15 (game engine, EV engine, state machine, stores, custom components, config system)

### Technical Constraints & Dependencies
- **100% Client-Side Logic:** No backend server for MVP. All game logic, EV computation, and persistence live in the browser.
- **NuxtJS + Nuxt-UI + Tailwind CSS:** Stack is already decided from PRD and UX spec.
- **localStorage Only:** No database, no authentication, no API calls for MVP.
- **No Real Money:** Strict educational-only positioning; no payment integrations.

### Cross-Cutting Concerns Identified
1. **Animation Timing Orchestration:** The Decision → EV Feedback (0ms) → Pause (500ms) → Card Reveal → Resolution sequence spans all components and is the product's core differentiator.
2. **Config-Driven Behavior:** FR17/FR18 require that game parameters (AI error rates, bonus amounts, level fees) are externalized and modifiable without code changes.
3. **Expert Mode State:** A global toggle that modifies rendering across multiple components (EVIndicator, ActionButtons, tooltips) — requires shared reactive state.
4. **Level Polymorphism:** Level 1 and Level 2 share the same game engine but with radically different dealer AI profiles and UI hint visibility.

## Starter Template Evaluation

### Primary Technology Domain
Full-stack Frontend (NuxtJS SPA + SSR landing pages) based on project requirements analysis. 100% client-side game logic with no backend for MVP.

### Starter Options Considered
- **Nuxt UI Template (`-t ui`):** Official Nuxt template with Nuxt UI v3 pre-configured. Lightweight, aligned with our decided stack.
- **T3 Stack / Full-Stack Starters:** Rejected — include backend tooling (tRPC, Prisma, NextAuth) we don't need. Adds unnecessary complexity.
- **Plain Nuxt Template:** Viable but requires manual Nuxt UI setup. The `-t ui` template saves configuration steps.

### Selected Starter: Nuxt 4 + Nuxt UI Template

**Rationale for Selection:**
The official Nuxt UI template is the most direct path to our target architecture. It pre-configures the exact design system we chose in UX specification (Nuxt-UI v3 with Tailwind CSS) with zero overhead from unused backend tooling.

**Initialization Command:**
```bash
npx nuxi@latest init bmad-test -t ui
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- Nuxt 4.4.x (Vue 3, TypeScript native)
- Node.js runtime with Nitro server engine

**Styling Solution:**
- Tailwind CSS v4 (integrated via @nuxt/ui)
- Design tokens configurable in `tailwind.config`

**Build Tooling:**
- Vite (development, HMR)
- Nitro (production builds, SSR/SSG/SPA modes)

**Testing Framework:**
- Not included by default — to be added (Vitest recommended for unit tests)

**Code Organization:**
- File-based routing (`app/pages/`)
- Auto-imported components (`app/components/`)
- Composables (`app/composables/`)
- Pinia stores (`app/stores/`) — added via module

**Development Experience:**
- Hot Module Replacement via Vite
- TypeScript with auto-generated types
- Vue DevTools integration

**Additional Modules Required Post-Init:**

| Module | Version | Purpose |
|---|---|---|
| `@pinia/nuxt` | v0.11.3 (Pinia v3.0.4) | Game state management, economy store, settings store |
| `@vueuse/nuxt` | Latest | Utility composables (useLocalStorage, useMediaQuery, etc.) |

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. State Management Architecture (Pinia store structure)
2. Game Engine State Machine (phase transitions)
3. EV Calculation Engine (sync vs async)
4. Deployment Strategy (SSG vs SSR)

**Deferred Decisions (Post-MVP):**
- Backend migration strategy (Phase 3)
- Authentication system (Phase 3)
- Multiplayer networking (Phase 3)
- Analytics pipeline (Phase 2)

### Data Architecture

**Decision: localStorage with Pinia Persistence**
- No database for MVP. All player data persisted via `@vueuse/useLocalStorage`.
- Data schema: flat key-value pairs (balance, level, settings, onboarding state).
- Commit strategy: Immediate write on hand resolution (NFR6 compliance).
- Migration path: When Phase 3 backend arrives, localStorage becomes a cache layer in front of API calls.

### State Management — 4 Specialized Pinia Stores

| Store | Responsibility | Persisted? |
|---|---|---|
| `useGameStore` | Current hand state (deck, dealt cards, game phase, result). Game flow state machine. | No (ephemeral) |
| `useEconomyStore` | Virtual balance, current level, progression history. Manages level-gating and bankruptcy detection. | **Yes** (localStorage) |
| `useSettingsStore` | Expert Mode toggle, UI preferences, sound volume. | **Yes** (localStorage) |
| `useConfigStore` | Admin parameters (AI error rate, EV bonus, entry fees). Loaded from static JSON file. | No (read-only, reloaded per session) |

**Rationale:** Separating ephemeral game state from persisted player state eliminates desynchronization bugs and makes unit testing trivial (mock one store at a time).

### Game Engine — Formal State Machine

**Decision: Explicit TypeScript enum-based state machine**

```typescript
enum GamePhase {
  IDLE,         // Waiting for bet
  BETTING,      // Player selecting bet amount
  DEALING,      // Card deal animation (~400ms)
  PLAYER_TURN,  // Player chooses Hit/Stand/Double
  EV_FEEDBACK,  // Celebration/correction animation (500ms pause)
  DEALER_TURN,  // Dealer plays out hand
  RESOLVING,    // Compute winner and payouts
  PAYOUT,       // Payout animation + balance update
}
```

**Rationale:** No XState dependency needed. A simple enum + switch in the Pinia store is sufficient for a linear game flow and remains highly testable. The `EV_FEEDBACK` phase is the critical innovation — it blocks transition to `DEALER_TURN` for exactly 500ms to create the "celebrate before reveal" pedagogical moment.

### EV Calculation Engine — Synchronous Main Thread

**Decision: Pure synchronous computation (no Web Worker)**

- Blackjack basic strategy EV is an O(1) lookup table, not a heavy computation.
- `computeEV(playerHand, dealerCard, deckState)` resolves in <1ms, well under the 50ms NFR1 threshold.
- A Web Worker would add unnecessary async communication complexity.
- Structure: `composables/useEvEngine.ts` exposing `computeEV()` and `getOptimalAction()`.
- Basic strategy data encoded as a constant TypeScript object (no network fetch).

### Infrastructure & Deployment

**Decision: Hybrid SSG + SPA on Vercel/Netlify**

- Landing page: SSG (pre-rendered) for SEO.
- Game page: Client-only SPA (`ssr: false` on `/game` route).
- Zero hosting cost on free tier for MVP.
- Nuxt config: `ssr: true` globally + per-route override for game engine.
- No server functions needed — all logic is client-side.

### Decision Impact Analysis

**Implementation Sequence:**
1. Project init (Nuxt UI template + Pinia + VueUse)
2. Config system (static JSON + `useConfigStore`)
3. Game engine core (`useGameStore` + state machine + deck logic)
4. EV engine (`useEvEngine` composable + basic strategy data)
5. Economy system (`useEconomyStore` + localStorage persistence)
6. UI layer (custom game components + Nuxt UI structural components)
7. Polish (animations, Expert Mode, onboarding flow)

**Cross-Component Dependencies:**
- `useGameStore` → depends on `useConfigStore` (for dealer AI profile) and `useEvEngine` (for EV computation)
- `useEconomyStore` → depends on `useGameStore` (subscribes to hand resolution events for balance updates)
- UI Components → depend on `useGameStore` (for current phase) and `useSettingsStore` (for Expert Mode toggle)

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Code Vue/TypeScript:**
- **Component files:** `PascalCase.vue` → `BmadCard.vue`, `CasinoActionButton.vue`
- **Composable files:** `camelCase.ts` → `useEvEngine.ts`, `useGameStore.ts`
- **Variables / functions:** `camelCase` → `playerHand`, `computeEV()`
- **Types / Enums:** `PascalCase` → `GamePhase`, `CardSuit`
- **Global constants:** `UPPER_SNAKE_CASE` → `BASIC_STRATEGY_TABLE`, `DEFAULT_STARTING_BALANCE`
- **localStorage keys:** Prefixed `bmad:` to avoid collisions → `bmad:balance`, `bmad:level`, `bmad:settings`
- **i18n translation keys:** Dot-notation `section.element` → `game.hit`, `onboarding.welcome`, `ev.positive_feedback`

### Structure Patterns

**Project Organization:**
```
app/
├── components/
│   ├── game/           # Custom game canvas components
│   │   ├── BmadCard.vue
│   │   ├── CasinoActionButton.vue
│   │   ├── ChipStack.vue
│   │   └── EVFeedbackOverlay.vue
│   └── ui/             # Structural components (wrapping Nuxt-UI)
│       ├── BalanceBar.vue
│       └── OnboardingTooltip.vue
├── composables/
│   ├── useEvEngine.ts  # EV computation (pure logic, no side effects)
│   └── useDeck.ts      # Deck management (shuffle, deal, state)
├── stores/
│   ├── useGameStore.ts
│   ├── useEconomyStore.ts
│   ├── useSettingsStore.ts
│   └── useConfigStore.ts
├── pages/
│   ├── index.vue       # Landing page (SSG, SEO)
│   └── game.vue        # Game engine (SPA, ssr: false)
├── types/
│   └── game.ts         # GamePhase enum, Card, Hand, etc.
├── locales/
│   ├── fr.json         # Default language
│   ├── nl.json
│   ├── en.json
│   └── de.json
└── assets/
    └── css/
        └── main.css    # Tailwind imports + custom casino tokens
public/
└── config/
    └── game-config.json  # Admin-editable parameters (FR17/FR18)
```

**Test Co-location Rule:** Unit tests are co-located next to source files (`useEvEngine.test.ts` beside `useEvEngine.ts`). No separate `__tests__/` directory.

### Internationalization (i18n)

**Module:** `@nuxtjs/i18n` (official Nuxt i18n module)

**Supported Languages (4 Belgian languages):**

| Code | Language | Default? |
|---|---|---|
| `fr` | Français | ✅ Yes |
| `nl` | Nederlands | No |
| `en` | English | No |
| `de` | Deutsch | No |

**Convention:** All user-facing text must use `$t('key')` or `useI18n()`. No hardcoded strings in Vue templates. Admin config JSON keys remain in English (internal technical parameters, not user content).

### Format Patterns

**Pinia Store Actions:** All actions that modify game state return `void` and emit side effects via `watch()` for persistence and animations.

**Config JSON (`game-config.json`):**
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
Keys in `camelCase`, no deep nesting.

### Process Patterns

**Error Handling:**
- Game logic errors (e.g., attempting to Hit after bust) are `console.warn()` in dev and silent no-ops in prod — never visible to the player.
- localStorage persistence errors are caught with `try/catch` and surfaced as a discreet `UNotification` toast.

**Loading States:**
- The game has no classic "loading spinner". The only loading state is the card dealing animation (400ms) which serves as a natural visual transition.

### Mandatory Rules for All AI Agents

1. **NEVER** use TypeScript `any`. All types must be defined in `types/game.ts`.
2. **NEVER** directly mutate Pinia state outside of the owning store's actions.
3. **ALWAYS** use Tailwind design tokens from the design system. No hardcoded hex colors in components.
4. **ALWAYS** co-locate tests with source files.
5. **NEVER** use `console.log()` in production — `console.warn()` in dev only.
6. **ALWAYS** use `$t('key')` or `useI18n()` for ALL user-facing text. No hardcoded strings in Vue templates.

## Project Structure & Boundaries

### Complete Project Directory Structure

```
bmad-test/
├── README.md
├── package.json
├── nuxt.config.ts
├── tsconfig.json
├── .env.example
├── .gitignore
├── vitest.config.ts
│
├── app/
│   ├── app.vue                       # Root: <UApp> wrapper + i18n provider
│   │
│   ├── pages/
│   │   ├── index.vue                 # Landing page (SSG, SEO) → FR16 disclaimer
│   │   └── game.vue                  # Game engine (SPA, ssr: false) → FR1-FR12
│   │
│   ├── components/
│   │   ├── game/                     # Custom game canvas — NO Nuxt-UI here
│   │   │   ├── BmadCard.vue          # Animated card (flip, deal, slide)
│   │   │   ├── DealerArea.vue        # Dealer card layout zone
│   │   │   ├── PlayerArea.vue        # Player card layout zone
│   │   │   ├── CasinoActionButton.vue # Hit/Stand/Double (48px touch targets)
│   │   │   ├── ChipStack.vue         # Isometric chip visualization
│   │   │   ├── EVFeedbackOverlay.vue # Gold shimmer / red pulse animation
│   │   │   ├── EVIndicator.vue       # Standard (glow) or Expert (numbers)
│   │   │   └── BettingControls.vue   # Bet selector + Deal button
│   │   │
│   │   └── ui/                       # Structural — wraps Nuxt-UI components
│   │       ├── BalanceBar.vue        # Top bar: balance + level + settings
│   │       ├── OnboardingTooltip.vue # Guided first-3-hands → FR15
│   │       ├── BackToBasicsModal.vue # Bankruptcy recovery → FR11
│   │       ├── LevelUnlockCelebration.vue # Full-screen celebration
│   │       ├── DisclaimerModal.vue   # Educational disclaimer → FR16
│   │       ├── LanguageSwitcher.vue  # i18n selector (FR/NL/EN/DE)
│   │       └── ExpertModeToggle.vue  # UToggle wrapper for Expert Mode
│   │
│   ├── composables/
│   │   ├── useEvEngine.ts            # EV computation → FR5, FR6
│   │   ├── useEvEngine.test.ts
│   │   ├── useDeck.ts                # Deck shuffle, deal → FR1
│   │   ├── useDeck.test.ts
│   │   ├── useHandResolver.ts        # Winner computation → FR3
│   │   ├── useHandResolver.test.ts
│   │   └── useDealerAI.ts            # Dealer behavior profiles → FR4
│   │
│   ├── stores/
│   │   ├── useGameStore.ts           # Game state machine → FR1-FR4
│   │   ├── useGameStore.test.ts
│   │   ├── useEconomyStore.ts        # Balance, levels, bankruptcy → FR8-FR12
│   │   ├── useEconomyStore.test.ts
│   │   ├── useSettingsStore.ts       # Expert Mode, preferences
│   │   └── useConfigStore.ts         # Admin config loader → FR17, FR18
│   │
│   ├── types/
│   │   └── game.ts                   # All TypeScript types & enums
│   │
│   ├── locales/
│   │   ├── fr.json                   # Français (default)
│   │   ├── nl.json                   # Nederlands
│   │   ├── en.json                   # English
│   │   └── de.json                   # Deutsch
│   │
│   └── assets/
│       └── css/
│           └── main.css              # @import "tailwindcss" + casino tokens
│
├── public/
│   ├── config/
│   │   └── game-config.json          # Admin-editable → FR17, FR18
│   └── favicon.ico
│
└── _bmad-output/                     # Planning artifacts (not deployed)
    └── planning-artifacts/
```

### Requirements to Structure Mapping

| FR | Primary File(s) |
|---|---|
| FR1 (Deck simulation) | `useDeck.ts` |
| FR2 (Wager) | `useEconomyStore.ts` + `BettingControls.vue` |
| FR3 (Hand resolution) | `useHandResolver.ts` |
| FR4 (Dealer AI profiles) | `useDealerAI.ts` + `useConfigStore.ts` |
| FR5-FR6 (EV computation) | `useEvEngine.ts` |
| FR7 (Educational feedback) | `EVFeedbackOverlay.vue` + `OnboardingTooltip.vue` |
| FR8 (EV bonus) | `useEconomyStore.ts` + `EVFeedbackOverlay.vue` |
| FR9-FR12 (Economy/Levels) | `useEconomyStore.ts` + `BackToBasicsModal.vue` |
| FR15 (Onboarding) | `OnboardingTooltip.vue` |
| FR16 (Disclaimer) | `DisclaimerModal.vue` |
| FR17-FR18 (Admin config) | `game-config.json` + `useConfigStore.ts` |

### Architectural Boundaries

**Component Boundaries:**
- `components/game/` → Custom Vue + CSS only. No Nuxt-UI imports allowed.
- `components/ui/` → Wraps Nuxt-UI components. No custom game logic.

**Dependency Direction Rule:** Dependencies flow top-down only:
```
UI Layer (Vue Components)
    ↓ reads
State Layer (Pinia Stores)
    ↓ calls
Logic Layer (Composables)
    ↓ accesses
Persistence Layer (localStorage / JSON)
```
- A composable MUST NEVER import a store.
- A store MUST NEVER import a component.
- Components read store state and call store actions only.

**Data Flow:**
- `useGameStore` → calls `useEvEngine`, `useDeck`, `useHandResolver`, `useDealerAI`
- `useGameStore` → notifies `useEconomyStore` on hand resolution
- `useEconomyStore` → persists to localStorage via `@vueuse/useLocalStorage`
- `useSettingsStore` → persists to localStorage via `@vueuse/useLocalStorage`
- `useConfigStore` → loads from `public/config/game-config.json` (read-only)
- `useDealerAI` → receives AI error rate as parameter from `useGameStore` (composable stays pure — does NOT import stores directly)

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices are verified compatible: Nuxt 4.4.x + Nuxt UI v3 + Pinia v3.0.4 + @vueuse/nuxt + @nuxtjs/i18n. All modules are designed for the Nuxt 4 / Vue 3 ecosystem. Tailwind CSS v4 is natively integrated via Nuxt UI — no double configuration. Vitest is the recommended test framework for Vite/Nuxt projects.

**Pattern Consistency:**
Naming conventions (PascalCase components, camelCase functions, UPPER_SNAKE constants) are consistent with the Vue/TypeScript ecosystem. The `game/` vs `ui/` component separation aligns with the UX spec "Two-Layer Strategy" (Nuxt-UI for structural UI, custom Vue+CSS for game canvas). The top-down dependency rule (UI → Stores → Composables → Persistence) is clean and testable.

**Structure Alignment:**
Every FR has an assigned file in the requirements mapping. No orphaned requirements.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**

| FR | Status | Component(s) |
|---|---|---|
| FR1-FR4 (Game Engine) | ✅ Covered | `useDeck`, `useHandResolver`, `useDealerAI`, `useGameStore` |
| FR5-FR8 (EV & Pedagogy) | ✅ Covered | `useEvEngine`, `EVFeedbackOverlay`, `useEconomyStore` |
| FR9-FR12 (Economy) | ✅ Covered | `useEconomyStore`, `BackToBasicsModal` |
| FR15 (Onboarding) | ✅ Covered | `OnboardingTooltip` |
| FR16 (Disclaimer) | ✅ Covered | `DisclaimerModal` |
| FR17-FR18 (Admin Config) | ✅ Covered | `game-config.json`, `useConfigStore` |

**Non-Functional Requirements Coverage:**

| NFR | Status | Strategy |
|---|---|---|
| NFR1 (<50ms EV calc) | ✅ | Synchronous O(1) lookup table |
| NFR2 (60 FPS animations) | ✅ | CSS hardware-accelerated transitions, no JS animation blocking |
| NFR3 (<2.5s TTI on 4G) | ✅ | SSG landing + SPA game, Vite tree-shaking |
| NFR4 (4.5:1 contrast) | ✅ | Palette validated in UX spec (11.2:1 for ivory/green) |
| NFR5 (Keyboard a11y) | ✅ | Nuxt-UI built-in ARIA + keyboard navigation |
| NFR6 (localStorage crash resilience) | ✅ | Immediate commit in `useEconomyStore` via `watch()` |

### Gap Analysis Results

**Issue Found & Resolved:**
- ⚠️ `useDealerAI.ts` originally depended on `useConfigStore` (a store), violating the rule "composables MUST NEVER import stores". **Resolution:** `useDealerAI(dealerHand, aiErrorRate)` now receives the AI error rate as a parameter injected by `useGameStore`, which reads it from `useConfigStore`. Composable purity restored.

**No Critical Gaps Remaining.**

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with verified versions
- [x] Technology stack fully specified (Nuxt 4 + Nuxt UI v3 + Pinia v3 + i18n)
- [x] State management architecture defined (4 Pinia stores)
- [x] Game engine state machine formalized (8 phases)
- [x] EV engine approach decided (synchronous lookup)
- [x] Deployment strategy defined (SSG + SPA hybrid)

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] i18n patterns specified (4 Belgian languages)
- [x] Process patterns documented (error handling, loading states)
- [x] 6 mandatory agent rules defined

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established (game/ vs ui/)
- [x] Dependency direction rule enforced
- [x] Requirements-to-structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** ✅ READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Simple, testable architecture with no over-engineering
- Clear separation of concerns between 4 specialized stores
- Exhaustive FR → file mapping for implementation traceability
- Explicit consistency rules for AI agent guidance
- Dependency direction rule prevents circular imports

**Areas for Future Enhancement (Post-MVP):**
- Backend API migration (Phase 3)
- E2E testing with Playwright
- CI/CD pipeline configuration
- Analytics and monitoring integration
- Cloud save with user accounts (Phase 3)

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries (game/ vs ui/, dependency direction)
- Refer to this document for all architectural questions
- All user-facing text must use i18n (`$t()` or `useI18n()`)

**First Implementation Priority:**
```bash
npx nuxi@latest init bmad-test -t ui
cd bmad-test
npx nuxi module add pinia
npx nuxi module add i18n
npm install @vueuse/nuxt
```

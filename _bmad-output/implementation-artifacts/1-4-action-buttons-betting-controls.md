# Story 1.4: Action Buttons & Betting Controls

Status: done

## Story

As a player,
I want responsive, touch-friendly action buttons and a simple betting system,
So that I can play comfortably on mobile with one hand.

## Acceptance Criteria

1. **Given** the game is in PLAYER_TURN phase, **When** the action buttons render, **Then** `CasinoActionButton` components (Hit, Stand, Double) are displayed with minimum 48x48px touch targets, **And** buttons have 8px gap between adjacent touch targets, **And** buttons show a physical depression animation on tap, **And** buttons are disabled during non-PLAYER_TURN phases (no layout shift — they gray out in place), **And** the Double button is only active when the player has exactly 2 cards.
2. **Given** the game is in IDLE or PAYOUT phase, **When** the `BettingControls` render, **Then** the player can select a bet amount using chip denomination buttons, **And** the default bet equals the last bet used (single-tap to repeat), **And** the "Deal" button starts a new hand.
3. **Given** NFR5 accessibility needs, **Then** all action buttons are accessible via keyboard (Tab to navigate, Space/Enter to activate).

## Tasks / Subtasks

- [x] Task 1: Create `CasinoActionButton` Component (AC 1, AC 3)
  - [x] Implement responsive button with 48x48px min touch target and 8px gaps.
  - [x] Add physical depression animation on tap using CSS transforms (`active:scale-95`).
  - [x] Support disabled state (grayed out) without causing layout shift.
  - [x] Enforce keyboard accessibility (focus states, Space/Enter activation).
- [x] Task 2: Create `BettingControls` Component (AC 2)
  - [x] Implement UI for selecting bet amounts via chip denomination buttons.
  - [x] Track the "last bet used" and set as default.
  - [x] Add the "Deal" button to initialize a new hand via `useGameStore.deal()`.
- [x] Task 3: Integrate with Game Engine (AC 1, AC 2)
  - [x] Wire `Hit`, `Stand`, and `Double` buttons to `useGameStore` actions in `game.vue`.
  - [x] Disable components outside their respective allowed phases (`PLAYER_TURN` for actions, `IDLE`/`PAYOUT` for betting).
  - [x] Ensure "Double" button is only enabled on the very first turn of `PLAYER_TURN` (i.e. hand length == 2).

## Dev Notes

- **Relevant Architecture Patterns:**
  - UI Components must be placed in `app/components/game/` because they are custom Vue/CSS and should not use Nuxt-UI structural styles.
  - Components read state and call store actions from `useGameStore`. Do not mutate directly.
  - Only use Tailwind tokens, no hardcoded hex colors.
  - Rely on `useI18n` or `$t` for translation keys related to "Hit", "Stand", "Double", "Deal". Do not hardcode strings.

- **Previous Story Intelligence (Story 1.3):**
  - We already have the game engine phases working perfectly (`useGameStore`). The engine now properly transitions from IDLE -> BETTING -> DEALING -> PLAYER_TURN.
  - Note: previous review deferred UI handling of exposing hidden cards to a UI layer. This story doesn't handle the dealer hidden card, but keep in mind that the UI bindings must read from `useGameStore` and push actions (`hit()`, `stand()`, `double()`) safely.
  
- **Source tree components to touch:**
  - `app/components/game/CasinoActionButton.vue` [NEW]
  - `app/components/game/BettingControls.vue` [NEW]
  - `app/pages/game.vue` [MODIFY]

## References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4]
- [Source: _bmad-output/planning-artifacts/architecture.md#Structure Patterns]

## Dev Agent Record

### Agent Model Used

Gemini 3.1 Pro (High)

### Debug Log References

- Fixed `game.vue` script tags after initial component replacement.
- Used multi-replace to ensure correct import resolution for tests.
- Fixed `vitest.config.ts` syntax error preventing tests from running initially.

### Completion Notes List

- ✅ Implemented `CasinoActionButton` component with required styling and accessibility.
- ✅ Implemented `BettingControls` with chip components and active states.
- ✅ Replaced mock cards in `game.vue` with real store integrations.
- ✅ Integrated buttons, correctly hooked into `useGameStore`.
- ✅ Automated tests for `CasinoActionButton` and `BettingControls` implemented and pass 100%.

### File List

- `app/components/game/CasinoActionButton.vue` [NEW]
- `app/components/game/BettingControls.vue` [NEW]
- `app/pages/game.vue` [MODIFY]
- `tests/components/CasinoActionButton.nuxt.test.ts` [NEW]
- `tests/components/BettingControls.nuxt.test.ts` [NEW]
- `vitest.config.ts` [MODIFY]

### Review Findings

- [x] [Review][Patch] BettingControls overlay blocks mouse but not keyboard focus [app/pages/game.vue:100]
- [x] [Review][Patch] useI18n fallback syntax is incorrect [app/components/game/BettingControls.vue:32]
- [x] [Review][Patch] Buttons have 16px gap instead of specified 8px [app/pages/game.vue:94]
- [x] [Review][Defer] Double condition might allow doubling after a split [app/pages/game.vue:20] — deferred, pre-existing

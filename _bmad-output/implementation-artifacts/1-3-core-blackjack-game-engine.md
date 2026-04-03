# Story 1.3: Core Blackjack Game Engine

Status: done

## Story

As a player,
I want to play a complete hand of Blackjack (deal, hit, stand, double down) with correct rules,
So that I can practice real Blackjack decisions.

## Acceptance Criteria

1. **Given** the game page is loaded and the `useDeck` composable is initialized, **When** the player taps "Deal", **Then** a standard 52-card deck is shuffled using the Fisher-Yates algorithm, **And** the player receives 2 face-up cards and the dealer receives 1 face-up + 1 face-down card, **And** the `useGameStore` state machine transitions through IDLE → BETTING → DEALING → PLAYER_TURN.
2. **Given** the player is in PLAYER_TURN phase, **When** the player taps "Hit", **Then** one card is dealt to the player's hand, **And** if the player's total exceeds 21, the hand is automatically resolved as bust.
3. **Given** the player is in PLAYER_TURN phase, **When** the player taps "Stand", **Then** the dealer reveals the hidden card and plays according to standard rules (hit on 16, stand on 17), **And** the `useHandResolver` composable computes the winner (player, dealer, or push).
4. **Given** the player is in PLAYER_TURN phase with exactly 2 cards, **When** the player taps "Double", **Then** the bet is doubled, one additional card is dealt, and the hand immediately resolves.
5. **Given** the testing rule, **Then** all unit tests pass for `useDeck.ts` and `useHandResolver.ts`.

## Developer Context & Guardrails (CRITICAL)

### Technical Requirements
- **State Machine Definition:** The state transitions are extremely specific (`IDLE` → `BETTING` → `DEALING` → `PLAYER_TURN` → `DEALER_TURN` → `RESOLVING` → `PAYOUT`). Use `useGameStore` properly to isolate this state.
- **Deck Shuffling:** Implement the Fisher-Yates shuffle algorithm inside `useDeck` composable rather than an arbitrary `Math.random() * length` shuffle.
- **Synchronous Logic:** The hand resolution in `useHandResolver.ts` should be entirely synchronous JavaScript (no async overhead needed).
- **Handling Phase Transitions:** Trigger animations by observing phase transitions.

### Architecture Compliance
- **Store Safety:** Remember, `useGameStore` is ephemeral and does not persist content to localStorage, whereas `useEconomyStore` does. The `useDeck.ts` and `useHandResolver.ts` composables MUST NOT import stores. They should take necessary state as arguments.
- **Testing:** `useDeck.test.ts` and `useHandResolver.test.ts` must be co-located next to their source files inside the `composables/` directory.

### File Structure Requirements
```text
app/
├── composables/
│   ├── useDeck.ts
│   ├── useDeck.test.ts
│   ├── useHandResolver.ts
│   └── useHandResolver.test.ts
├── stores/
│   └── useGameStore.ts
```

### Previous Story Intelligence (Story 1.2)
- Table Layout and UI logic already exist (e.g. `BmadCard` to display states). This story needs to tie the abstract models (Hand, Deck, Card properties) to the visual components constructed in `1.2`.
- Make sure to not break the Zero Layout Shift Rule introduced earlier. Cards added via Hit should not mess up layout constraints.

## Tasks / Subtasks

- [x] Task 1: Create Deck Composable (AC 1)
  - [x] Implement `useDeck` with Fisher-Yates.
  - [x] Write `useDeck.test.ts`.
- [x] Task 2: Implement Hand Resolution (AC 3, 5)
  - [x] Implement `useHandResolver.ts` logic to compute values safely (handling Aces as 1/11).
  - [x] Write `useHandResolver.test.ts` to cover soft/hard hands and edge cases.
- [x] Task 3: Build Game Store state machine (AC 1, 2, 3, 4)
  - [x] Hook logic for "Deal", "Hit", "Stand", "Double" actions in `useGameStore.ts`.
  - [x] Handle busts synchronously.

## Dev Agent Record

Ultimate context engine analysis completed - comprehensive developer guide created.

### Completion Notes
✅ `useDeck.ts` with Fisher-Yates implementation completed.
✅ `useHandResolver.ts` logic for exact evaluation of soft/hard Hands and Winner logic completed.
✅ `useGameStore.ts` refactored as a Setup Store inside Pinia, managing IDLE -> BETTING -> DEALING -> PLAYER_TURN -> DEALER_TURN -> RESOLVING -> PAYOUT correctly.

### File List
- `app/composables/useDeck.ts` [NEW]
- `app/composables/useDeck.test.ts` [NEW]
- `app/composables/useHandResolver.ts` [NEW]
- `app/composables/useHandResolver.test.ts` [NEW]
- `app/stores/useGameStore.ts` [MODIFIED]
- `app/stores/useGameStore.test.ts` [NEW]

### Change Log
- Added `useDeck`, `useHandResolver` logic.
- Rewrote `useGameStore` to Setup Store to seamlessly integrate composables.
- Added comprehensive unit tests for deck, hand evaluation, and Vue Pinia game state execution. Tested locally via `vitest` with 100% pass rate.

### Review Findings

- [x] [Review][Decision] **BETTING phase skipped in state machine** — Resolved: added transient BETTING phase transition in `deal()`
- [x] [Review][Patch] **`deal()` has no phase guard** — Fixed: guard added (IDLE or PAYOUT only) [useGameStore.ts:42]
- [x] [Review][Patch] **Non-deterministic store tests** — Fixed: mocked `useDeck` for deterministic cards [useGameStore.test.ts]
- [x] [Review][Patch] **`deal()` doesn't reset `currentBet`** — Fixed: `currentBet` reset to 0 in `deal()` [useGameStore.ts:45]
- [x] [Review][Patch] **Vitest picks up Playwright E2E files** — Fixed: created `vitest.config.ts` with E2E exclusion
- [x] [Review][Defer] **`dealerHand.total` exposes hidden card** [useGameStore.ts:19] — deferred, UI layer concern for future story
- [x] [Review][Defer] **Deck exhaustion during dealer turn** [useGameStore.ts:78-80] — deferred, near-impossible with single deck

# Deferred Work

## Deferred from: code review of story-1.3 (2026-04-03)

- **`dealerHand.total` exposes hidden card** â€” `useGameStore.ts:19`: The `dealerHand` computed property includes the face-down card value. UI layer must NOT bind directly to `dealerHand.total` during PLAYER_TURN. Address when building the game UI display logic.
- **Deck exhaustion during dealer turn** â€” `useGameStore.ts:78-80`: If the deck runs out during the dealer's while loop, `drawCard()` throws an unhandled error. Near-impossible with a single 52-card deck and one player. Address when implementing multi-deck shoes or multi-hand modes.

## Deferred from: code review of 1-2-card-rendering-table-layout (2026-04-03)
- Horizontal Overflow on large hands [game.vue] — design limit for multiple stacked cards on mobile not fully spec'd.

## Deferred from: code review of 1-4-action-buttons-betting-controls (2026-04-03)
- Double condition might allow doubling after a split [game.vue:20] — canDouble only checks if playerHandCards.length === 2. If the user splits and gets a second card, length is 2. The logic might need to ensure it's the initial turn. Currently, split is not implemented, so this is a future consideration.

## Deferred from: code review of 1-5-balance-bar-game-chrome (2026-04-19)
- Hardcoded animation duration [app/components/ui/BalanceBar.vue:14] — duration hardcoded in script vs Tailwind class, pre-existing structural choice.
- Potential text overlap [app/components/ui/BalanceBar.vue:20] — edge case on ultra-narrow screens without explicit shrink handling.

## Deferred from: code review of 2-1-ev-calculation-engine (2026-04-19)
- Split EV does not model re-splitting pairs — the current DP calculates one level of splitting only. Proper re-split modeling is out of scope for the basic strategy engine and would require tracking split depth. Address if/when multi-split support is added.

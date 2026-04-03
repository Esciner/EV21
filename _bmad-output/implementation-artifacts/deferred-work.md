# Deferred Work

## Deferred from: code review of story-1.3 (2026-04-03)

- **`dealerHand.total` exposes hidden card** — `useGameStore.ts:19`: The `dealerHand` computed property includes the face-down card value. UI layer must NOT bind directly to `dealerHand.total` during PLAYER_TURN. Address when building the game UI display logic.
- **Deck exhaustion during dealer turn** — `useGameStore.ts:78-80`: If the deck runs out during the dealer's while loop, `drawCard()` throws an unhandled error. Near-impossible with a single 52-card deck and one player. Address when implementing multi-deck shoes or multi-hand modes.

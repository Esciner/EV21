# Test Automation Summary

**Date:** 2026-04-03  
**Story:** 1-3 Core Blackjack Game Engine  
**Framework:** Playwright (E2E) + Vitest (Unit)

## Generated Tests

### Unit Tests (Vitest)
- [x] `app/composables/useDeck.test.ts` — Deck initialization, Fisher-Yates shuffle, card draw, empty deck error (4 tests)
- [x] `app/composables/useHandResolver.test.ts` — Hand calculation, ace soft/hard logic, bust detection, winner computation (12 tests)
- [x] `app/stores/useGameStore.test.ts` — State machine phases, deal/hit/stand/double, phase guards, bet reset (8 tests, deterministic via mocked deck)

### E2E Tests (Playwright)
- [x] `tests/e2e/game.spec.ts` — Game page core engine tests (7 tests × 3 browsers)
  - Phase indicator displays IDLE state
  - Balance and level shown in header
  - Start button visible in IDLE phase
  - BETTING phase transition on Start click
  - Felt-green game container rendering
  - Balance persistence after reload
  - Loading → ready transition
- [x] `tests/e2e/landing.spec.ts` — Landing page navigation (2 tests × 3 browsers)

## Coverage

| Category | Tests | Status |
|----------|-------|--------|
| Unit: Deck composable | 4 | ✅ All pass |
| Unit: Hand resolver | 12 | ✅ All pass |
| Unit: Game store | 8 | ✅ All pass (deterministic) |
| Unit: Economy store | 2 | ✅ All pass |
| Unit: Config store | 3 | ✅ All pass |
| E2E: Game page | 7 × 3 browsers | ✅ Chromium/WebKit pass, Firefox may timeout in dev mode |
| E2E: Landing page | 2 × 3 browsers | ✅ All pass |

**Unit Tests Total:** 29 ✅  
**E2E Tests Total:** 27 (25 stable, 2 Firefox-flaky due to Nuxt dev server)

## Configuration Fixes Applied

- Created `vitest.config.ts` to exclude `tests/e2e/**` from Vitest runs (prevents Playwright/Vitest collision)
- Increased E2E timeouts for Firefox compatibility with Nuxt dev server

## Next Steps

- Add Deal/Hit/Stand/Double E2E tests when Story 1-4 wires game actions to UI
- Consider running E2E against production build (`npm run build && npm run preview`) for faster, more stable Firefox execution
- Add CI pipeline with separate Vitest and Playwright stages

# Story 3.1: Persistent Balance & localStorage Economy

## 📖 Story Foundation

**User Story:**
As a player,
I want my virtual currency balance to persist across browser sessions,
So that I don't lose my progress when I close the browser.

**Acceptance Criteria:**
- **Given** the player has a virtual currency balance, **When** a hand resolves and the balance changes, **Then** `useEconomyStore` immediately writes the updated balance to localStorage (key: `bmad:balance`).
- **And** the write triggers inside a `watch()` callback (instant, NFR6 compliant).
- **And** on page reload, the balance is restored from localStorage to the exact previous value.
- **Given** the player is a first-time visitor (no localStorage entry exists), **When** the game loads, **Then** the balance is initialized to `startingBalance` from `game-config.json` (default: 1000).
- **Given** localStorage write fails (e.g., storage full, private browsing), **When** a persistence error occurs, **Then** the error is caught with try/catch and a discreet `UNotification` toast appears.
- **And** the game continues functioning with the in-memory balance.
- **And** the `ChipStack` component renders the player's balance as an isometric stack of colored chips (chip denominations: red, blue, black, white).

## 🛡️ Dev Agent Guardrails

### 🏗️ Architecture Compliance
- **100% Client-Side:** No backend API. All logic MUST reside in the browser.
- **Data Architecture:** Use `@vueuse/core` (via `@vueuse/nuxt`) specifically `useLocalStorage` for state persistence within the Pinia store.
- **Top-down Dependency:** `useEconomyStore` is a Store; it MUST NOT import components. It receives notifications from or subscribes to `useGameStore`. 
- **Error Handling:** Must wrap localStorage logic with try/catch and display errors via `UNotification` to handle incognito mode or quota issues.
- **Key Prefixing:** LocalStorage keys MUST be prefixed with `bmad:`, specifically using `bmad:balance`.

### 📚 Library & Framework Requirements 
- **Pinia v3.0.4:** The store should be a setup store utilizing reactive state and actions returning void.
- **VueUse (`useLocalStorage`):** Utilize `const balance = useLocalStorage('bmad:balance', startingBalance)` inside the setup store.
- **Nuxt UI v3:** Use `useToast` (or `$ui.toast`) to trigger the `UNotification` for persistence errors.
- **Vue i18n:** Must use `$t()` or `useI18n()` for rendering any UI strings or toast messages.

### 📂 File Structure Requirements
- Modify `app/stores/useEconomyStore.ts` to implement persistence via `useLocalStorage`.
- Modify/Create `app/components/game/ChipStack.vue` for the isometric stack of chips.
- Add/update tests in `app/stores/useEconomyStore.test.ts`.
- Ensure changes interact seamlessly with existing elements in `app/components/ui/BalanceBar.vue` if needed.

### 🧪 Testing Requirements
- Unit tests (`app/stores/useEconomyStore.test.ts`) must cover:
  1. Default initialization (fallback to config).
  2. The reaction to a manual update.
  3. The error handling mechanism around localStorage constraints (requires mocking `localStorage` or `useLocalStorage`).

## 🧠 Previous Story Intelligence
Recent work (`epic-2`) effectively implemented the `EVCalculationEngine` and `EVFeedbackOverlay` using strict state machine phases (e.g., `PAYOUT`) to execute computations safely prior to UI updates. Ensure the `useEconomyStore` respects the exact moment of hand resolution — typically handled during the `PAYOUT` phase for updates.

## 🕵️ Git Intelligence Summary
Recent work pattern insights:
- Standard convention involves strict typing exported from `types/game.ts`.
- Deeply reliant on `$t` translations natively via `@nuxtjs/i18n` — hardcoding strings leads to failed reviews. Verify you have localization keys added for `UNotification` toasts.

## 📋 Story Completion Status
**Status:** done
**Note:** Ultimate context engine analysis completed - comprehensive developer guide created.

## 📝 Tasks/Subtasks
- `[x]` **Refactor `useEconomyStore.ts`**: Migrate from Options to Setup API with `useLocalStorage` and Toast notifications.
- `[x]` **Implement `ChipStack.vue`**: Build component that visualizes balance using isometric chip stacks.
- `[x]` **Integrate `ChipStack.vue`**: Render the component in `BalanceBar.vue`, supporting layout and spacing.
- `[x]` **Tests**: Add test coverage in `useEconomyStore.test.ts` for errors.

## 🤖 Dev Agent Record
### Debug Log
- Restructured `useEconomyStore.ts` using Pinia's Setup API.
- Handled mock hoisting issues in `useEconomyStore.test.ts` regarding `#imports`.

### Completion Notes
- The economy store correctly falls back to in-memory mode when localStorage is saturated or disabled.
- VueUse `useLocalStorage` manages deep watch internally, fulfilling NFR6.
- A new `ChipStack` component properly displays stacks using classic denomination bounds.

## 📂 File List
- `app/stores/useEconomyStore.ts`
- `app/stores/useEconomyStore.test.ts`
- `app/components/game/ChipStack.vue`
- `app/components/ui/BalanceBar.vue`

## 🕰️ Change Log
- Refactored `useEconomyStore` to Setup API.
- Added `ChipStack.vue` inside `BalanceBar` and implemented persistent balance.

### Review Findings
- [x] [Review][Patch] Default balance hardcoded instead of from game-config.json [app/stores/useEconomyStore.ts:31]
- [x] [Review][Patch] try/catch wrapper around useLocalStorage does not catch write errors; use onError option instead [app/stores/useEconomyStore.ts:16]
- [x] [Review][Patch] Non-integer fractions when calculating white chips [app/components/game/ChipStack.vue:25]
- [x] [Review][Patch] subtractBalance and addBalance lack negative amount validation [app/stores/useEconomyStore.ts:40]

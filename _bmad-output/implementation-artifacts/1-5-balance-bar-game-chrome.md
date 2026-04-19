# Story 1.5: Balance Bar & Game Chrome

Status: done

## Story

As a player,
I want to see my virtual currency balance and current game status at a glance,
So that I can track my progress without leaving the game table.

## Acceptance Criteria

1. **Given** the game page is loaded, **When** the `BalanceBar` component renders, **Then** it displays the player's current virtual currency balance in gold text.
2. **And** it shows the current level badge ("LEVEL 1" or "LEVEL 2").
3. **And** it includes a settings icon (for future Expert Mode and language switcher).
4. **And** the balance bar is fixed at the top (40px height) and does not scroll with the page.
5. **Given** a hand resolves, **When** the balance updates, **Then** the balance display updates with a brief gold flash animation for wins.

## Tasks / Subtasks

- [x] Task 1: Create `BalanceBar` UI Component structure (AC 1, AC 2, AC 3, AC 4)
  - [x] Implement responsive fixed top bar strictly adhering to 40px height. Place the file in `app/components/ui/BalanceBar.vue` (structural UI domain).
  - [x] Render the player's currency balance (`balance`) using the `gold` colored text and `JetBrains Mono` or `Space Mono` font for numeric readability (UX-DR2).
  - [x] Render the level badge using a Nuxt-UI `<UBadge>` styled with casino tokens. Use translation keys for "LEVEL X".
  - [x] Add a settings icon button placeholder using Nuxt-UI `<UButton icon="i-heroicons-cog-8-tooth">` to prevent reinventing interactive elements.
- [x] Task 2: Reactivity & Economy Store Integration (AC 1, AC 2)
  - [x] Read `balance` and `level` directly from `useEconomyStore()`.
  - [x] Format the balance for display and ensure real-time reactivity without manual local synchronization.
- [x] Task 3: Balance Change Animation (AC 5)
  - [x] Add a Vue `watch` on the store's `balance` value.
  - [x] When the new value is strictly greater than the old value (a win), trigger a local Vue state flag `isFlashing=true` for ~300ms.
  - [x] Bind this flag to CSS classes that trigger a gold glow/flash transformation (e.g., using `text-gold` with CSS drop-shadow/pulse or custom tailwind animations).
- [x] Task 4: Layout Integration (AC 4)
  - [x] Add `<BalanceBar>` at the very top of the layout inside `app/pages/game.vue`.
  - [x] Ensure the Zero Layout Shift rule is respected: the inclusion of this 40px bar must NOT displace the lower `~120px` dealer card area or cause vertical scrolling unresolvable by the Flex container.

## Dev Notes

- **Architecture Rules to strictly follow:**
  - UI components utilizing Nuxt-UI features MUST be located in `app/components/ui/` (e.g. `BalanceBar.vue`), unlike previously created bespoke canvas components which reside in `app/components/game/`.
  - Always use `@nuxtjs/i18n` with `$t('key')` for ALL user-facing strings (e.g., "LEVEL"). DO NOT HARDCODE STRINGS.
  - Depend only on Pinia state. Read from `useEconomyStore()`.
- **Previous Story Intelligence (from Story 1.4):**
  - We successfully implemented components emitting `useGameStore` interactions. Ensure equivalent standards for `useEconomyStore`.
  - Ensure automated Nuxt component tests are added: `tests/components/BalanceBar.nuxt.test.ts`, matching 100% pass expectations established in Story 1.4.
  - Verify `app/pages/game.vue`'s flexible layout cleanly handles the new 40px top bar without overflowing mobile 100vh parameters.
- **Latest Technical specifics:** 
  - Nuxt-UI `icon` props rely on the `@iconify` collections. Utilize established prefixes like `i-heroicons-*` for any placeholder icons.
  - To watch Pinia getters seamlessly, structure your watcher correctly: `watch(() => economyStore.balance, (newVal, oldVal) => { ... })`.

### Project Structure Notes

- `app/components/ui/BalanceBar.vue` [NEW]
- `tests/components/BalanceBar.nuxt.test.ts` [NEW]
- `app/pages/game.vue` [MODIFY]

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.5]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Spacing & Layout Foundation]
- [Source: _bmad-output/planning-artifacts/architecture.md#Structure Patterns]

## Dev Agent Record

### Agent Model Used

Gemini 3.1 Pro (High)

### Debug Log References

### Completion Notes List

- Implemented `BalanceBar` component utilizing standard Vue component API with `<script setup>`.
- Reactivity linked correctly to `economyStore` via computed outputs.
- Flashing animations achieved with Vue's `watch` reacting instantly to balance increases with dynamic Tailwind drop-shadow and transforms.
- Tested successfully by mocking `$t` via `mountSuspended` in Vitest, avoiding injection failures.
- Layout Zero-Shift maintained by enforcing `flex-none h-[40px]` instead of `fixed`, ensuring clean encapsulation inside the Nuxt layout's flex container without floating overlaps.

### File List
- `app/components/ui/BalanceBar.vue` [NEW]
- `tests/components/BalanceBar.nuxt.test.ts` [NEW]
- `app/pages/game.vue` [MODIFY]

### Review Findings
- [x] [Review][Decision] Aria label unlocalized — `<UButton aria-label="Settings">` is used without localization map; need to decide if we should localize this now.
- [x] [Review][Patch] Leaked debug config in nuxt.config.ts [`nuxt.config.ts`]
- [x] [Review][Patch] Unmount timeout leak in BalanceBar [`app/components/ui/BalanceBar.vue:12-14`]
- [x] [Review][Patch] Race condition on repeated flashes [`app/components/ui/BalanceBar.vue:10-15`]
- [x] [Review][Patch] Naive i18n text manipulation / Casing rules [`app/components/ui/BalanceBar.vue:31`]
- [x] [Review][Patch] Missing number formatting [`app/components/ui/BalanceBar.vue:25`]
- [x] [Review][Patch] Fragile test assertions [`tests/components/BalanceBar.nuxt.test.ts:34`]
- [x] [Review][Patch] Missing currency ARIA label [`app/components/ui/BalanceBar.vue`]
- [x] [Review][Defer] Hardcoded animation duration [`app/components/ui/BalanceBar.vue:14`] — deferred, pre-existing
- [x] [Review][Defer] Potential text overlap [`app/components/ui/BalanceBar.vue:20`] — deferred, pre-existing

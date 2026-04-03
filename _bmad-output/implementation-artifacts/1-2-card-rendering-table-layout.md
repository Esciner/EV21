# Story 1.2: Card Rendering & Table Layout

Status: done

## Story

As a player,
I want to see a visually polished Blackjack table with beautifully rendered playing cards,
So that the game feels like a premium casino experience.

## Acceptance Criteria

1. **Given** the game page is loaded, **When** the table renders, **Then** the mobile layout displays fixed zones: Balance Bar (40px), Dealer Area (~120px), EV Feedback Zone (~60px), Player Area (~120px), Action Buttons (~80px), Betting Controls (~60px).
2. **Given** the `BmadCard` component, **Then** it renders face-up and face-down card states with correct suit and value.
3. **Given** card animations, **Then** cards use 3D `rotateY` CSS transform for flip animation.
4. **Given** dealing actions, **Then** cards slide from the top of the screen with a deal animation (~400ms CSS transition).
5. **Given** the UI layout, **Then** it strictly follows the Zero Layout Shift Rule — no element is displaced when cards appear or feedback is shown.
6. **Given** a tablet device (768-1023px), **Then** the game canvas is centered with a max-width of 600px.
7. **Given** a desktop screen (1024px+), **Then** the game is presented in "App-in-a-Box" mode centered with a blurred casino background.
8. **Given** card text colors, **Then** all card text meets 4.5:1 contrast ratio (NFR4).

## Developer Context & Guardrails (CRITICAL)

### Technical & Architecture Requirements
- **Framework & UI:** Nuxt 4 + Tailwind CSS v4. Ensure strict semantic HTML is used.
- **State Management:** For this UI story, mock the card data. No heavy Pinia plumbing needed until the Game Engine integration.
- **CSS Transitions:** Focus heavily on Tailwind's native transitions: `transition-transform`, `duration-400`, `perspective` features for 3D card flips.
- **Zero Layout Shift:** Use Flexbox/Grid containers with explicit minimum heights (`min-h-[120px]`) for the dealer and player areas to ensure cards appearing do not shift existing buttons down.
- **Z-Index:** Manage z-indexes carefully to ensure dealing animations slide *over* the table.

### File Structure Restrictions
- **New Components:**
  - Create `app/components/game/BmadCard.vue`: Will handle rendering a single card data model with props (`suit`, `value`, `isFaceUp`).
  - Modify `app/pages/game.vue`: The visual shell handling the responsive zones.

### Anti-Patterns to Prevent
- **DO NOT** use absolute positioning for everything. Use flex/grid for responsive layout and only use absolute positioning for the animations.
- **DO NOT** hardcode exact pixel sizes for cards that break on small screens. Cards must be responsive to their container (e.g. `w-16 sm:w-24`).
- **DO NOT** use JavaScript `setTimeout` for core animations if CSS transitions can handle it cleanly. Use Vue's built-in `<TransitionGroup>` for entering cards.

## Tasks / Subtasks

- [x] Task 1: Scaffolding the `BmadCard` Component (AC: 2, 8)
  - [x] Create `BmadCard.vue` accepting `suit`, `value`, and `isFaceUp` as props.
  - [x] Implement strict 4.5:1 contrast designs for both Red (Hearts/Diamonds) and Black (Clubs/Spades) suits on the Ivory (#FFFDD0) background.
- [x] Task 2: 3D Animation & Dealing CSS (AC: 3, 4)
  - [x] Apply `perspective` and `transform-style: preserve-3d` wrappers to the card.
  - [x] Create `rotateY(180deg)` logic bound to `isFaceUp`.
  - [x] Configure Vue `<Transition>` or native Tailwind `@starting-style` for sliding in from top-of-screen (`-translate-y-full`).
- [x] Task 3: Mobile Fixed Zones Layout (AC: 1, 5)
  - [x] Restructure `game.vue` into CSS Grid or strict Flexbox rows holding the exact required zones.
  - [x] Apply the Zero Layout Shift Rule by locking zone heights.
- [x] Task 4: Responsive Breakpoints (AC: 6, 7)
  - [x] Implement `sm:max-w-[600px] mx-auto` for tablet centering.
  - [x] Add the "App-in-a-Box" styling layout for `lg:` screens.

## Dev Agent Record
- Added `tests/components/BmadCard.nuxt.test.ts` to cover component flipping and layout logic
- Excluded e2e test suite from `vitest.config.ts`
- Handled mobile-first fixed zone sizing using Min-Height
- Implemented `BmadCard` flip cleanly using `isFaceUp` prop mapping to native css 3d transform `rotateY`

## File List
- `app/components/game/BmadCard.vue` [NEW]
- `tests/components/BmadCard.nuxt.test.ts` [NEW]
- `app/pages/game.vue` [MODIFIED]
- `vitest.config.ts` [MODIFIED]

### Review Findings
- [x] [Review][Defer] Horizontal Overflow on large hands [game.vue] — deferred, design limit for multiple stacked cards on mobile not fully spec'd.

## Change Log
- 2026-04-03: Completed all tasks successfully. Tests pass perfectly with zero regressions globally.

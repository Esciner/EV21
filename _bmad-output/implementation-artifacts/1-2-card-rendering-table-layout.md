# Story 1.2: Card Rendering & Table Layout

Status: ready-for-dev

## Story

As a player,
I want to see a visually polished Blackjack table with beautifully rendered playing cards,
So that the game feels like a premium casino experience.

## Acceptance Criteria

1. **Given** the game page is loaded, **When** the table renders, **Then** the mobile layout displays fixed zones: Balance Bar (40px), Dealer Area (~120px), EV Feedback Zone (~60px), Player Area (~120px), Action Buttons (~80px), Betting Controls (~60px).
2. **Given** the `BmadCard` component is used, **Then** it renders face-up and face-down card states with correct suit and value.
3. **Given** the card animation requirements, **Then** cards use 3D `rotateY` CSS transform for flip animation.
4. **Given** the dealing mechanism, **Then** cards slide from the top of the screen with a deal animation (~400ms CSS transition).
5. **Given** the UX constraint, **Then** the layout follows the Zero Layout Shift Rule — no element is displaced when cards appear.
6. **Given** different device sizes, **Then** on tablet (768-1023px), the game canvas is centered with a max-width of 600px.
7. **Given** a desktop view, **Then** on desktop (1024px+), the game is presented in "App-in-a-Box" mode centered with a blurred casino background.
8. **Given** accessibility standards, **Then** all card text meets 4.5:1 contrast ratio (NFR4).

## Developer Context & Guardrails (CRITICAL)

### Technical Requirements
- **Framework & Styling:** Vue 3 + Tailwind CSS v4. Nuxt-UI components are for structural wrappers only (`components/ui/`), while game components (`components/game/`) must be custom Vue components without Nuxt-UI dependencies.
- **Responsiveness & Layout:** Fixed sizing on mobile to enforce the "Zero Layout Shift Rule". The 6 fixed vertical zones (Balance, Dealer, EV Zone, Player, Actions, Betting) must be strictly sized.
- **Card Animations:** Use pure CSS transitions and transforms (`transform: rotateY()`, `transition: all 400ms ease`) to maintain 60 FPS instead of JS animation libraries. Create distinct classes for `.is-flipped` and entering states.
- **Color Context:** Remember semantic colors (felt-green `#0C3B2E`, gold `#D4AF37`, ivory `#FFFDD0`). Must ensure the 4.5:1 contrast ratio for any card texts (NFR4). Ivory and black/red should be used for the card faces.

### Architecture Compliance
- **Component File Locations:** 
  - `BmadCard.vue` should go to `app/components/game/BmadCard.vue`.
  - Game specific layout wrappers can also be in `game/` or directly inside `app/pages/game.vue` using standard HTML tags.
- **Language/i18n:** Avoid static textual content. Any alt text or aria-labels for the cards or layout should use strings imported via `$t()`.

### File Structure Requirements
```text
app/
├── pages/
│   └── game.vue                # Update the game layout
├── components/
│   ├── game/                   # Custom Vue components (no Nuxt-UI)
│   │   ├── BmadCard.vue        # Animated card (flip, deal)
│   │   ├── DealerArea.vue      # Optional layer
│   │   └── PlayerArea.vue      # Optional layer
```

### Previous Story Intelligence (Story 1.1)
- The Nuxt configuration and CSS tokens for `felt-green`, `gold`, and `ivory` are fully initialized. Use them directly.
- Font styling (Inter, JetBrains Mono) is available. Use `font-mono` (JetBrains Mono) for card values to give them a clear, mathematical feel.
- Validation from Story 1.1 patched several things: stick to native HTML wrappers styled with Tailwind instead of heavy NuxtUI components for the game board to ensure layout stability ("Do NOT use `@nuxt/ui-pro` components... Use standard semantic HTML tags").

## Tasks / Subtasks

- [ ] Task 1: Create BmadCard Component (AC 2, 3, 4, 8)
  - Implement 3D flip animation (`rotateY`) and deal animation (translate from top) in CSS.
  - Implement face-up/face-down slots or states. 
  - Ensure font readability and contrast.
- [ ] Task 2: Implement Game Page Layout (AC 1, 5)
  - Create the 6 fixed sizing zones in `pages/game.vue` or subcomponents (`DealerArea`, `PlayerArea`).
  - Adhere to the "Zero Layout Shift Rule". Pre-allocate space so rendering a card does not push content down.
- [ ] Task 3: Device Scale & Centering (AC 6, 7)
  - Add Tailwind rules (`md:`, `lg:`) to center the table on tablet and provide the desktop "App-in-a-Box" visual with the blurred background.
- [ ] Task 4: Accessibility and Polish
  - Verify aria-labels on cards and layout regions.

## Dev Agent Record

Ultimate context engine analysis completed - comprehensive developer guide created.

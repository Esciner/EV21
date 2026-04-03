---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# bmad-test - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for bmad-test, decomposing the requirements from the PRD, UX Design Specification, and Architecture Decision Document into implementable stories.

## Requirements Inventory

### Functional Requirements

- FR1: The system can accurately simulate a standard 52-card blackjack deck, enforcing rules for shuffling, dealing, hitting, standing, and doubling down.
- FR2: Players can wager virtual currency balances on hands.
- FR3: The system resolves hands strictly adhering to standard rules to automatically compute the winner.
- FR4: The system executes simulated dealer behavior according to the currently active difficulty profile (e.g., standard rules vs intentional errors).
- FR5: The system computes the absolute Expected Value (EV) of every available player action in real-time, relying only on visible cards.
- FR6: The system detects and flags actions possessing a negative EV relative to the mathematically optimal baseline.
- FR7: The system renders educational UI feedback outlining why a selected sub-optimal move is statistically detrimental.
- FR8: The system issues explicit bonus virtual currency when the user executes the mathematically optimal choice, regardless of the hand's subsequent randomized outcome.
- FR9: The system persists a user's virtual currency balance universally across browser sessions.
- FR10: The system gates player access sequentially to difficulty levels based on possessed virtual currency.
- FR11: The system actively detects bankrupt states to automatically route users to the "Free Play" rehabilitative loop.
- FR12: The system enforces a rigid ceiling limit on payouts generated in the rehabilitative level, matching exactly the entry cost of the standard gameplay level.
- FR13: The system provides an Expert Mode toggle that switches the EV feedback display between a visual-only mode (color-coded glows and plain-language tooltips) and a data-rich mode (exact EV values, bust probabilities, and basic strategy notation).
- FR14: The Expert Mode preference persists across browser sessions.
- FR15: The system can present a guided onboarding sequence to first-time users, introducing the core game controls, the EV cheat-sheet, and the educational tooltip system before their first hand.
- FR16: The system can display a persistent, prominently visible educational disclaimer stating the application is for educational purposes only and does not involve real-money gambling.
- FR17: Administrators can dynamically manipulate the likelihood coefficient determining exactly how often Level 1 AI commits sub-optimal errors.
- FR18: Administrators can adjust key global variables (starting cash, EV bonus size, level entry fees, level-up threshold) via standard configuration without redeploying the core engine.
- FR19: The system supports 4 languages (Français, Nederlands, English, Deutsch) with automatic browser language detection and a manual language switcher accessible from the game interface.

### NonFunctional Requirements

- NFR1: All Expected Value background calculations must resolve and return data to the UI thread in under 50 milliseconds.
- NFR2: Hand resolution, tooltip rendering, and card animations must maintain 60 FPS on a baseline modern mobile standard (iPhone 11).
- NFR3: The application's Time-to-Interactive (TTI) must not exceed 2.5 seconds on a generic 4G connection.
- NFR4: Card imagery, educational overlays, and vital text components must retain a 4.5:1 minimum contrast ratio.
- NFR5: Core operational loops (Hit, Stand, Double) must be entirely accessible via standard generic keyboard actions (Tab, Space, Enter).
- NFR6: The local storage commit execution must trigger instantaneously upon hand resolution, preventing user progress degradation resulting from unexpected browser closure.

### Additional Requirements

- AR1: Project initialization using Nuxt 4 + Nuxt UI v3 starter template (`npx nuxi@latest init bmad-test -t ui`).
- AR2: Pinia v3.0.4 module installation and configuration for state management.
- AR3: @vueuse/nuxt module installation for utility composables (useLocalStorage, useMediaQuery).
- AR4: @nuxtjs/i18n module installation and configuration with 4 locale files.
- AR5: Vitest testing framework setup and configuration.
- AR6: Hybrid SSG (landing page) + SPA (game page with `ssr: false`) deployment configuration.
- AR7: Static `game-config.json` in `public/config/` for admin-editable parameters.
- AR8: 4 specialized Pinia stores architecture (useGameStore, useEconomyStore, useSettingsStore, useConfigStore).
- AR9: GamePhase enum-based state machine with 8 phases (IDLE → BETTING → DEALING → PLAYER_TURN → EV_FEEDBACK → DEALER_TURN → RESOLVING → PAYOUT).
- AR10: Synchronous EV calculation engine (O(1) lookup table in useEvEngine composable).
- AR11: Top-down dependency direction rule (UI → Stores → Composables → Persistence).

### UX Design Requirements

- UX-DR1: Design Token Implementation — Felt-green (#0C3B2E), gold (#D4AF37), ivory (#FFFDD0) palette + semantic EV colors (ev-positive #22C55E, ev-negative #EF4444, ev-neutral #F59E0B) + chip colors + dark background system.
- UX-DR2: Typography System — Inter font for UI, JetBrains Mono or Space Mono for card values and Expert Mode numbers. 6-level type scale (Display 32px to Micro 12px).
- UX-DR3: Custom Component `BmadCard` — Animated playing card with flip (3D rotateY), deal (slide from top), and dimmed states. Responsive sizing.
- UX-DR4: Custom Component `CasinoActionButton` — Hit/Stand/Double buttons with 48px minimum touch targets, EV-Positive green glow state, EV-Negative red pulse state, physical depression animation, haptic feedback trigger.
- UX-DR5: Custom Component `EVFeedbackOverlay` — Gold shimmer/confetti animation for EV+ decisions, localized red warning glow for EV- decisions. Fires at 0ms (instant) on player decision, before card resolution.
- UX-DR6: Custom Component `ChipStack` — Isometric stacked chip visualization colored by denomination (red/blue/black/white). Adding chips (drop animation) and removing chips (slide away animation).
- UX-DR7: Custom Component `EVIndicator` — Dual-mode display: Standard Mode shows color glow only, Expert Mode shows exact EV values + bust probabilities.
- UX-DR8: Custom Component `BettingControls` — Bet amount selector with chip denomination buttons + Deal button. Default bet = last bet used (single-tap to repeat).
- UX-DR9: Zero Layout Shift Rule — Game interface has fixed-size layout on mobile. Appearance of cards, EV tooltips, or Deal button must NEVER displace other elements.
- UX-DR10: Onboarding Flow — Contextual tooltips woven into first 3 hands (not a separate tutorial). Progressive disclosure: explicit text hints → color-coded hints only.
- UX-DR11: Back to Basics Modal — Warm, coaching-tone copy ("The professor welcomes you back"). Auto-routes to Level 1 with reset balance. Dark UModal with backdrop blur.
- UX-DR12: Level Unlock Celebration — Full-screen congratulatory animation with message when player reaches Level 2 threshold.
- UX-DR13: Mobile Layout — Fixed zones: Balance Bar (40px), Dealer Area (~120px), EV Feedback Zone (~60px), Player Area (~120px), Action Buttons (~80px), Betting Controls (~60px).
- UX-DR14: Responsive Strategy — Mobile-first portrait (320-767px) → Tablet centered max-width 600px (768-1023px) → Desktop "App-in-a-Box" centered with blurred casino background (1024px+).

### FR Coverage Map

| FR | Epic | Description |
|---|---|---|
| FR1 | Epic 1 | Deck simulation (useDeck composable) |
| FR2 | Epic 1 | Wager system (BettingControls + useGameStore) |
| FR3 | Epic 1 | Hand resolution (useHandResolver composable) |
| FR4 | Epic 4 | Dealer AI profiles (useDealerAI composable) |
| FR5 | Epic 2 | EV computation (useEvEngine composable) |
| FR6 | Epic 2 | EV- detection and flagging |
| FR7 | Epic 2 | Educational feedback UI (EVFeedbackOverlay) |
| FR8 | Epic 2 | EV bonus virtual currency |
| FR9 | Epic 3 | Balance persistence (useEconomyStore + localStorage) |
| FR10 | Epic 3 | Level gating |
| FR11 | Epic 3 | Bankruptcy detection + Back to Basics |
| FR12 | Epic 3 | Rehab payout cap |
| FR13 | Epic 5 | Expert Mode toggle |
| FR14 | Epic 5 | Expert Mode persistence |
| FR15 | Epic 6 | Onboarding guided tooltips |
| FR16 | Epic 6 | Educational disclaimer |
| FR17 | Epic 4 | AI error rate configuration |
| FR18 | Epic 7 | Global config variables |
| FR19 | Epic 6 | i18n 4 languages |

## Epic List

### Epic 1: Project Foundation & Game Table
The player can see a functional Blackjack table with animated cards and play a complete hand (Hit/Stand/Double) against a standard dealer.
**FRs covered:** FR1, FR2, FR3
**ARs covered:** AR1, AR2, AR3, AR5, AR6, AR7, AR8, AR9, AR11
**UX-DRs covered:** UX-DR1, UX-DR2, UX-DR3, UX-DR4, UX-DR8, UX-DR9, UX-DR13, UX-DR14

### Epic 2: EV Pedagogy Engine
The player receives instant educational feedback on every decision. The system celebrates EV-optimal choices and explains sub-optimal ones, with the feedback firing BEFORE the hand outcome is revealed.
**FRs covered:** FR5, FR6, FR7, FR8
**ARs covered:** AR9 (EV_FEEDBACK phase), AR10
**UX-DRs covered:** UX-DR5, UX-DR7
**NFRs covered:** NFR1

### Epic 3: Dynamic Player Economy & Level System
The player has a persistent virtual currency, can progress from Level 1 to Level 2, and is protected from soft-lock via the Back to Basics rehabilitation loop.
**FRs covered:** FR9, FR10, FR11, FR12
**NFRs covered:** NFR6
**UX-DRs covered:** UX-DR6, UX-DR11, UX-DR12

### Epic 4: Dealer AI Profiles & Level Differentiation
Level 1 features a "dumb dealer" that makes visible mathematical errors, while Level 2 follows standard casino rules. The AI error rate is configurable.
**FRs covered:** FR4, FR17

### Epic 5: Expert Mode & Display Modes
The player can toggle between a simplified visual feedback mode (color glows) and a data-rich mathematical display (exact EV values, bust probabilities).
**FRs covered:** FR13, FR14
**UX-DRs covered:** UX-DR7 (dual-mode evolution)

### Epic 6: Onboarding, Compliance & Internationalization
New users are guided through their first 3 hands, see the educational disclaimer, and can use the app in their language (FR/NL/EN/DE).
**FRs covered:** FR15, FR16, FR19
**ARs covered:** AR4
**UX-DRs covered:** UX-DR10

### Epic 7: Admin Configuration & Game Tuning
The administrator can adjust all game parameters (AI error rate, starting balance, EV bonus, level-up threshold) via the JSON config file without redeployment.
**FRs covered:** FR18

---

## Epic 1: Project Foundation & Game Table

The player can see a functional Blackjack table with animated cards and play a complete hand (Hit/Stand/Double) against a standard dealer.

### Story 1.1: Project Scaffolding & Design System

As a developer,
I want the Nuxt 4 project initialized with all required modules and the casino design system configured,
So that all subsequent stories have a working foundation.

**Acceptance Criteria:**

**Given** no project exists
**When** the initialization commands are run (`npx nuxi@latest init bmad-test -t ui`, Pinia, VueUse, Vitest)
**Then** the project builds and runs with `npm run dev`
**And** Tailwind CSS is configured with casino design tokens (felt-green, gold, ivory palette)
**And** Inter font is loaded from Google Fonts
**And** JetBrains Mono is loaded for game numbers
**And** the `app/types/game.ts` file defines the GamePhase enum, Card, Hand, and Suit types
**And** the 4 Pinia store files are scaffolded (useGameStore, useEconomyStore, useSettingsStore, useConfigStore)
**And** `public/config/game-config.json` exists with all default parameter values
**And** the game page (`app/pages/game.vue`) is configured with `ssr: false`
**And** the landing page (`app/pages/index.vue`) renders with SSG

### Story 1.2: Card Rendering & Table Layout

As a player,
I want to see a visually polished Blackjack table with beautifully rendered playing cards,
So that the game feels like a premium casino experience.

**Acceptance Criteria:**

**Given** the game page is loaded
**When** the table renders
**Then** the mobile layout displays fixed zones: Balance Bar (40px), Dealer Area (~120px), EV Feedback Zone (~60px), Player Area (~120px), Action Buttons (~80px), Betting Controls (~60px)
**And** the `BmadCard` component renders face-up and face-down card states with correct suit and value
**And** cards use 3D `rotateY` CSS transform for flip animation
**And** cards slide from the top of the screen with a deal animation (~400ms CSS transition)
**And** the layout follows the Zero Layout Shift Rule — no element is displaced when cards appear
**And** on tablet (768-1023px), the game canvas is centered with a max-width of 600px
**And** on desktop (1024px+), the game is presented in "App-in-a-Box" mode centered with a blurred casino background
**And** all card text meets 4.5:1 contrast ratio (NFR4)

### Story 1.3: Core Blackjack Game Engine

As a player,
I want to play a complete hand of Blackjack (deal, hit, stand, double down) with correct rules,
So that I can practice real Blackjack decisions.

**Acceptance Criteria:**

**Given** the game page is loaded and the `useDeck` composable is initialized
**When** the player taps "Deal"
**Then** a standard 52-card deck is shuffled using the Fisher-Yates algorithm
**And** the player receives 2 face-up cards and the dealer receives 1 face-up + 1 face-down card
**And** the `useGameStore` state machine transitions through IDLE → BETTING → DEALING → PLAYER_TURN

**Given** the player is in PLAYER_TURN phase
**When** the player taps "Hit"
**Then** one card is dealt to the player's hand
**And** if the player's total exceeds 21, the hand is automatically resolved as bust

**Given** the player is in PLAYER_TURN phase
**When** the player taps "Stand"
**Then** the dealer reveals the hidden card and plays according to standard rules (hit on 16, stand on 17)
**And** the `useHandResolver` composable computes the winner (player, dealer, or push)

**Given** the player is in PLAYER_TURN phase with exactly 2 cards
**When** the player taps "Double"
**Then** the bet is doubled, one additional card is dealt, and the hand immediately resolves

**And** all unit tests pass for `useDeck.ts` and `useHandResolver.ts`

### Story 1.4: Action Buttons & Betting Controls

As a player,
I want responsive, touch-friendly action buttons and a simple betting system,
So that I can play comfortably on mobile with one hand.

**Acceptance Criteria:**

**Given** the game is in PLAYER_TURN phase
**When** the action buttons render
**Then** `CasinoActionButton` components (Hit, Stand, Double) are displayed with minimum 48x48px touch targets
**And** buttons have 8px gap between adjacent touch targets
**And** buttons show a physical depression animation on tap
**And** buttons are disabled during non-PLAYER_TURN phases (no layout shift — they gray out in place)
**And** the Double button is only active when the player has exactly 2 cards

**Given** the game is in IDLE or PAYOUT phase
**When** the `BettingControls` render
**Then** the player can select a bet amount using chip denomination buttons
**And** the default bet equals the last bet used (single-tap to repeat)
**And** the "Deal" button starts a new hand

**And** all action buttons are accessible via keyboard (Tab to navigate, Space/Enter to activate) (NFR5)

### Story 1.5: Balance Bar & Game Chrome

As a player,
I want to see my virtual currency balance and current game status at a glance,
So that I can track my progress without leaving the game table.

**Acceptance Criteria:**

**Given** the game page is loaded
**When** the `BalanceBar` component renders
**Then** it displays the player's current virtual currency balance in gold text
**And** it shows the current level badge ("LEVEL 1" or "LEVEL 2")
**And** it includes a settings icon (for future Expert Mode and language switcher)
**And** the balance bar is fixed at the top (40px height) and does not scroll with the page
**And** when a hand resolves, the balance display updates with a brief gold flash animation for wins

---

## Epic 2: EV Pedagogy Engine

The player receives instant educational feedback on every decision. The system celebrates EV-optimal choices and explains sub-optimal ones, with the feedback firing BEFORE the hand outcome is revealed.

### Story 2.1: EV Calculation Engine

As a player,
I want the system to know the mathematically optimal action for every situation,
So that it can evaluate my decisions against the correct strategy.

**Acceptance Criteria:**

**Given** a player hand and a dealer visible card
**When** `useEvEngine.computeEV(playerHand, dealerCard)` is called
**Then** it returns the EV value for each available action (Hit, Stand, Double)
**And** `getOptimalAction(playerHand, dealerCard)` returns the action with the highest EV
**And** the basic strategy lookup table covers all standard hand combinations (hard totals 4-21, soft totals 13-21, pairs 2-2 through A-A)
**And** computation resolves in <1ms (verified via unit test benchmark, well under NFR1 50ms threshold)
**And** all unit tests pass for `useEvEngine.ts` covering edge cases (soft 17, dealer Ace, Blackjack)

### Story 2.2: EV Feedback Overlay & Decision Celebration

As a player,
I want to see an immediate visual celebration when I make a mathematically optimal choice — BEFORE the cards are revealed,
So that I feel rewarded for the quality of my decision, not the randomness of the outcome.

**Acceptance Criteria:**

**Given** the player is in PLAYER_TURN phase and makes a decision (Hit/Stand/Double)
**When** the decision matches the optimal EV action
**Then** the `EVFeedbackOverlay` fires a gold shimmer/confetti animation over the action area at 0ms (instant)
**And** action buttons briefly show a green glow state (EV-Positive)
**And** a toast notification appears: "Great call!" (via `$t('ev.positive_feedback')`)

**Given** the player makes a sub-optimal decision
**When** the action does NOT match the optimal EV action
**Then** the `EVFeedbackOverlay` fires a localized red warning glow (not full-screen — contained to the action area)
**And** an educational tooltip explains WHY the optimal play was different (via `$t()` i18n keys)
**And** the tooltip disappears automatically after 2 seconds or on tap

**Given** the EV feedback has fired
**When** 500ms elapses (EV_FEEDBACK phase timer)
**Then** the game transitions to DEALER_TURN and the dealer reveals their hidden card
**And** animations maintain 60 FPS throughout the sequence (NFR2)

### Story 2.3: EV Bonus Currency System

As a player,
I want to receive bonus virtual currency every time I make the mathematically optimal choice,
So that I'm financially rewarded for good decisions regardless of the hand outcome.

**Acceptance Criteria:**

**Given** the player made the EV-optimal decision during the hand
**When** the hand resolves (PAYOUT phase)
**Then** an EV bonus is added to the player's balance (calculated as wager × `evBonusMultiplier` from config)
**And** the bonus amount is displayed separately from the hand payout (e.g., "Hand: +100 | EV Bonus: +75")
**And** a chip animation shows bonus chips flying to the player's stack
**And** the bonus is awarded whether the player WON or LOST the hand (the critical pedagogical mechanic)

**Given** the player made a sub-optimal decision
**When** the hand resolves
**Then** no EV bonus is awarded
**And** the standard hand payout (win/lose/push) still applies normally

---

## Epic 3: Dynamic Player Economy & Level System

The player has a persistent virtual currency, can progress from Level 1 to Level 2, and is protected from soft-lock via the Back to Basics rehabilitation loop.

### Story 3.1: Persistent Balance & localStorage Economy

As a player,
I want my virtual currency balance to persist across browser sessions,
So that I don't lose my progress when I close the browser.

**Acceptance Criteria:**

**Given** the player has a virtual currency balance
**When** a hand resolves and the balance changes
**Then** `useEconomyStore` immediately writes the updated balance to localStorage (key: `bmad:balance`)
**And** the write triggers inside a `watch()` callback (instant, NFR6 compliant)
**And** on page reload, the balance is restored from localStorage to the exact previous value

**Given** the player is a first-time visitor (no localStorage entry exists)
**When** the game loads
**Then** the balance is initialized to `startingBalance` from `game-config.json` (default: 1000)

**Given** localStorage write fails (e.g., storage full, private browsing)
**When** a persistence error occurs
**Then** the error is caught with try/catch and a discreet `UNotification` toast appears
**And** the game continues functioning with the in-memory balance

**And** the `ChipStack` component renders the player's balance as an isometric stack of colored chips (chip denominations: red, blue, black, white)

### Story 3.2: Level Gating & Level 2 Unlock

As a player,
I want to unlock Level 2 when I've earned enough virtual currency,
So that I feel a sense of accomplishment and progression.

**Acceptance Criteria:**

**Given** the player is on Level 1
**When** the player's balance reaches the `levelUpThreshold` (default: 1500) from config
**Then** the `LevelUnlockCelebration` component triggers a full-screen congratulatory animation
**And** the level badge in the `BalanceBar` updates from "LEVEL 1" to "LEVEL 2"
**And** the level state is persisted to localStorage (key: `bmad:level`)
**And** on subsequent visits, the player starts on Level 2

**Given** the player is on Level 2
**When** the game loads
**Then** the player plays under standard casino rules (dealer follows standard hit/stand rules)
**And** EV hints are NOT shown by default (no button glow) unless Expert Mode is enabled

### Story 3.3: Bankruptcy Detection & Back to Basics

As a player,
I want to be automatically helped when I go bankrupt instead of being stuck,
So that I can learn from my mistakes and return to the real game.

**Acceptance Criteria:**

**Given** the player is on Level 2
**When** the player's balance reaches 0 after a hand resolution
**Then** the `BackToBasicsModal` appears with warm, coaching-tone copy (via `$t('economy.back_to_basics')`)
**And** the modal uses dark UModal with backdrop blur
**And** the player's balance is reset to `startingBalance` from config (1000)
**And** the level is set back to Level 1
**And** changes are persisted to localStorage

**Given** the player is in the rehabilitation loop (Level 1 after bankruptcy)
**When** the player earns virtual currency through gameplay
**Then** payouts are capped at `rehabPayoutCap` from config (default: 500) — the player earns exactly enough to re-enter Level 2
**And** once balance reaches `levelUpThreshold`, Level 2 is unlocked again with the celebration animation

---

## Epic 4: Dealer AI Profiles & Level Differentiation

Level 1 features a "dumb dealer" that makes visible mathematical errors, while Level 2 follows standard casino rules. The AI error rate is configurable.

### Story 4.1: Dealer AI Engine with Configurable Profiles

As a player,
I want the Level 1 dealer to make obviously bad mathematical decisions,
So that I can learn to recognize sub-optimal plays by observing the dealer's mistakes.

**Acceptance Criteria:**

**Given** the player is on Level 1
**When** the dealer plays their hand (DEALER_TURN phase)
**Then** the `useDealerAI` composable applies the `level1AiErrorRate` from config (default: 0.4 = 40% chance of error)
**And** errors include: hitting on 19+, standing on 12-14, or other clearly sub-optimal plays
**And** the AI error rate parameter is received from `useGameStore` (not imported directly from the store — composable stays pure)

**Given** the player is on Level 2
**When** the dealer plays their hand
**Then** the dealer follows standard casino rules: hit on soft 17, stand on hard 17+
**And** no intentional errors are introduced

**Given** the admin changes `level1AiErrorRate` in `game-config.json`
**When** the configuration is reloaded (page refresh)
**Then** the new error rate is applied without code changes

### Story 4.2: Level Visual Differentiation

As a player,
I want Level 1 and Level 2 to feel visually distinct,
So that the transition feels like a genuine accomplishment.

**Acceptance Criteria:**

**Given** the player is on Level 1
**When** the game renders
**Then** action buttons show EV hint glows (green/orange/red based on EV quality)
**And** educational tooltips are more frequent and explicit
**And** the level badge shows "LEVEL 1" with a distinct color

**Given** the player is on Level 2
**When** the game renders
**Then** action buttons are neutral (no EV hint glows by default)
**And** educational tooltips are minimal (only on sub-optimal decisions, not proactive hints)
**And** the level badge shows "LEVEL 2" with a premium gold color
**And** the player relies on internalized knowledge rather than visual aids

---

## Epic 5: Expert Mode & Display Modes

The player can toggle between a simplified visual feedback mode (color glows) and a data-rich mathematical display (exact EV values, bust probabilities).

### Story 5.1: Expert Mode Toggle & Data Display

As an advanced player or educator,
I want to see the exact EV values and bust probabilities for every action,
So that I can verify my mathematical reasoning and teach probability concepts.

**Acceptance Criteria:**

**Given** the Expert Mode toggle is OFF (Standard Mode — default)
**When** the `EVIndicator` renders during PLAYER_TURN
**Then** it shows only color-coded glows (green = EV+, red = EV-, amber = marginal)
**And** tooltips use plain language (via `$t()` i18n keys)

**Given** the Expert Mode toggle is ON
**When** the `EVIndicator` renders during PLAYER_TURN
**Then** it shows exact EV values for each action (e.g., "Hit: EV = +0.12 | Stand: EV = -0.08")
**And** bust probability percentage is displayed inline
**And** values are rendered in JetBrains Mono at 14px minimum (UX-DR2)
**And** basic strategy notation references are shown

**Given** the player toggles Expert Mode via `ExpertModeToggle` (UToggle component)
**When** the toggle is changed
**Then** the preference is persisted to localStorage (key: `bmad:settings`) via `useSettingsStore` (FR14)
**And** the display mode switches instantly without page reload

---

## Epic 6: Onboarding, Compliance & Internationalization

New users are guided through their first 3 hands, see the educational disclaimer, and can use the app in their language (FR/NL/EN/DE).

### Story 6.1: Educational Disclaimer

As a new user,
I want to see a clear educational disclaimer before playing,
So that I understand this is a learning tool and not real gambling.

**Acceptance Criteria:**

**Given** the player visits the app for the first time (or the landing page)
**When** the game loads
**Then** the `DisclaimerModal` appears with a prominently visible educational disclaimer (via `$t('disclaimer.text')`)
**And** the disclaimer states the app is for educational purposes only and does not involve real-money gambling
**And** the modal must be acknowledged before gameplay can begin
**And** the disclaimer acknowledgment is persisted to localStorage

### Story 6.2: Guided Onboarding — First 3 Hands

As a first-time player,
I want to be guided through my first hands with contextual tooltips,
So that I understand how to play and what the EV system means without reading a manual.

**Acceptance Criteria:**

**Given** the player has never played before (no onboarding completion in localStorage)
**When** Hand 1 is dealt
**Then** an `OnboardingTooltip` appears pointing to the action buttons explaining Hit/Stand/Double
**And** the tooltip highlights the button with the best EV glow

**Given** the player is on Hand 2
**When** the hand is dealt
**Then** a tooltip explains what the EV indicator means ("Green = smart move, Red = risky move")
**And** the tooltip is contextual to the current hand situation

**Given** the player is on Hand 3
**When** the hand is dealt
**Then** a tooltip introduces the EV bonus concept ("You earn extra chips for making the math-correct choice!")
**And** after Hand 3 resolves, onboarding completion is persisted to localStorage
**And** no more onboarding tooltips appear in future sessions

**And** all onboarding text uses `$t()` i18n keys (progressive disclosure: text hints → color-only)

### Story 6.3: Internationalization & Language Switcher

As a Belgian user,
I want to use the app in my preferred language (FR, NL, EN, or DE),
So that I can learn probability concepts without language barriers.

**Acceptance Criteria:**

**Given** a new user visits the app
**When** the app loads
**Then** the browser language is auto-detected via `@nuxtjs/i18n`
**And** if the browser language matches a supported locale (fr, nl, en, de), that locale is selected
**And** if unsupported, French (fr) is used as the default fallback

**Given** the user wants to change language
**When** the user opens the `LanguageSwitcher` in the Balance Bar
**Then** 4 language options are shown (Français, Nederlands, English, Deutsch)
**And** selecting a language instantly switches all user-facing text
**And** the preference is persisted to localStorage

**And** all 4 locale JSON files (fr.json, nl.json, en.json, de.json) contain translations for all user-facing strings
**And** admin config JSON keys remain in English (internal technical parameters)

---

## Epic 7: Admin Configuration & Game Tuning

The administrator can adjust all game parameters via the JSON config file without redeployment.

### Story 7.1: End-to-End Config Parameter Validation

As an administrator,
I want to verify that all game parameters in `game-config.json` correctly affect gameplay,
So that I can tune the game economy without code changes.

**Acceptance Criteria:**

**Given** `game-config.json` contains the following keys:
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

**When** any parameter value is changed and the page is refreshed
**Then** `useConfigStore` loads the updated values from the JSON file
**And** `startingBalance` correctly sets the initial balance for new players
**And** `levelUpThreshold` correctly triggers the Level 2 unlock celebration
**And** `evBonusMultiplier` correctly scales the EV bonus payout
**And** `level1AiErrorRate` correctly adjusts the dealer's error frequency in Level 1
**And** `rehabPayoutCap` correctly limits earnings during the Back to Basics loop
**And** no code changes or redeployment are needed — config changes propagate on page load (FR18)

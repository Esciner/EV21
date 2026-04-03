---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-bmad-test.md
  - _bmad-output/planning-artifacts/product-brief-bmad-test-distillate.md
workflowType: prd
briefCount: 2
researchCount: 0
brainstormingCount: 0
projectDocsCount: 0
classification:
  projectType: web_app
  domain: edtech
  complexity: medium
  projectContext: greenfield
---

# Product Requirements Document - bmad-test

**Author:** Esciner  
**Date:** 2026-04-01T13:16:58+02:00

## Executive Summary

This project is an educational web application designed to teach probability and game theory fundamentals to beginners via a gamified Blackjack experience. Taking a novel approach, the core mechanic explicitly decouples the player's decision from the chaotic outcome of the cards. By actively rewarding mathematically optimal Expected Value (EV) choices—even when variance leads to a lost hand—the application rewires how players perceive risk. The ultimate goal is to break down abstract academic statistics into a highly engaging, zero-financial-risk learning loop.

## Project Classification

- **Project Type:** Web Application (Vue.js / NuxtJS / Nuxt-UI frontend)
- **Domain:** Educational Technology (EdTech) / Applied Math
- **Complexity:** Medium
- **Context:** Greenfield (New codebase)

## Success Criteria

### User Success Indicators
- **Conceptual Grasp:** Users demonstrate an understanding of Expected Value within their first 3 sessions.
- **Measurable Improvement:** Complete beginners progress by identifying poor AI decisions in Level 1, achieving a >50% accuracy baseline to advance smoothly without frustration.
- **Empowerment:** Qualitative feedback indicates players feel far less intimidated by probability calculations after interacting with the UI.

### Business & Operational Metrics
- **Engagement Loop:** Over 50% of users who successfully complete the Level 1 "Free Play" phase transition to and play at least 10 hands in the standard Level 2 environment.
- **Retention via Anti-Softlock:** The system avoids user abandonment when a player goes bankrupt. Players utilizing the "Back to Basics" Level 1 loop successfully return to the main game.

### Technical Benchmarks
- **Persistence Accuracy:** The local storage system persists virtual currency balances and level progression with 100% accuracy across browser sessions.
- **Performance Fidelity:** Expected Value (EV) background calculations resolve in <50ms, allowing Nuxt-UI CSS transitions & card animations to render at an unbroken 60 frames-per-second (FPS).

## User Journeys

### Journey 1: Alice, The Curious Beginner (Core Flow)
- **Situation:** Alice wants to learn Blackjack but hates financial risk and textbook dryness. She logs into the app and receives 1,000 virtual chips, entering Level 1: "The Dumb Dealer".
- **Action:** As she plays, the AI opponent intentionally makes catastrophic mathematical errors (e.g., hitting on 19). An animated Nuxt-UI tooltip explains *why* the move was EV-negative. When Alice is faced with a tricky hand (12 vs dealer's 6), she stands, adhering to the EV sheet. Even if the dealer hits 21, Alice is explicitly rewarded with bonus chips for making the "EV-Positive" decision.
- **Resolution:** Having grasped the core probability concepts, she earns enough "EV Points" to unlock Level 2 (Standard Casino Rules) feeling prepared.

### Journey 2: Bob, The Stubborn Player (Soft-Lock Recovery)
- **Situation:** Bob rushes into Level 2, ignoring the math and playing purely via "gut feeling". His bankroll quickly hits zero.
- **Action:** Instead of encountering a paywall or a hard "Game Over", the system triggers the "Back to Basics" protocol, routing Bob back to the free Level 1. To earn his Level 2 entry fee back, the game forces him to correct his bad habits by making explicitly optimal EV decisions. His payout is strictly capped so he earns *exactly* enough to re-enter Level 2.
- **Resolution:** Bob returns to the main game with a restored bankroll and a heavily corrected understanding of probability.

### Journey 3: Charlie, The Curating Admin (Operations Flow)
- **Situation:** Charlie monitors engagement by reviewing player behavior patterns.
- **Action:** Noticing a sharp drop-off of users failing to transition to Level 2, he edits the game's static JSON configuration file (`game-config.json`). He increases the Level 1 optimal-play reward and adjusts the AI error rate. *(Note: For MVP, administration is performed by directly editing the JSON configuration file deployed with the application. A dedicated admin dashboard UI is deferred to Phase 2.)*
- **Resolution:** The changes propagate on the next page load without a code deploy, stabilizing the conversion funnel.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy
- **MVP Approach:** "Experience MVP". The absolute priority is to validate whether the act of rewarding EV decisions over card luck feels satisfying and actually works as a teaching method.
- **Resource Constraints:** Designed to be feasible for a solo developer or very small team, entirely leveraging NuxtJS and Nuxt-UI components with local storage to avoid backend overhead.

### Phase 1: MVP Feature Set
- Complete Single-player Blackjack game engine supporting variable difficulty profiles.
- Purely browser-based local storage economy (Virtual currency wallet + Level gating).
- Real-time Expected Value (EV) calculation engine triggering immediate UI educational tooltips.
- Minimal backend/JSON file configuration to tweak AI thresholds and basic payouts.

**Explicitly Out of Scope for Phase 1:**
- Split (splitting pairs into two hands)
- Insurance (side-bet against dealer blackjack)
- Surrender (forfeiting half the bet to exit a hand)

These standard blackjack actions are deferred to Phase 2 to keep the MVP focused on core EV pedagogy with Hit/Stand/Double only.

### Phase 2: Growth Features
- Player historical analytics UI showing visual breakdowns of common mistimed decisions.
- Global leaderboards tracking pure "EV-positive decisions" rather than total accumulated bankroll.
- Advanced difficulties (Multi-deck environments, introductory card-counting strategies).

### Phase 3: Vision Expansion
- Full backend migration for synchronized cloud saving and persistent user accounts.
- Multiplayer "Ghost" Mode: Async competition where players attempt to out-EV others on identically seeded decks.
- Expanded curriculum moving beyond basic strategy into advanced Game Theory concepts.

### Risk Minimization
- **Technical Stutter:** Offloading logic from the UI thread, heavily utilizing tailwind hardware-accelerated transitions.
- **Pedagogical Dryness:** Injecting high "juice" into the UI (crisp chip sounds, celebratory feedback for math choices) to avoid feeling like a math test.
- **Scope Creep:** Strict commitment to keeping logic client-side and avoiding authentication systems initially.

## Architecture & Integration Boundaries

### Domain & Compliance Constraints
- **Regulatory Guardrails:** Features simulated gambling mechanics but requires strict educational disclaimers. Must fundamentally avoid any mechanic that allows real-world deposits, withdrawals, or crypto-integration to bypass restrictive gambling laws. 
- **Integrations:** For MVP, the system operates completely standalone. No external LMS or payment gateway integrations are necessary.

## Functional Requirements (Capability Contract)

### Game Session Execution
- **FR1:** The system can accurately simulate a standard 52-card blackjack deck, enforcing rules for shuffling, dealing, hitting, standing, and doubling down.
- **FR2:** Players can wager virtual currency balances on hands.
- **FR3:** The system resolves hands strictly adhering to standard rules to automatically compute the winner.
- **FR4:** The system executes simulated dealer behavior according to the currently active difficulty profile (e.g., standard rules vs intentional errors).

### Expected Value & Pedagogy System
- **FR5:** The system computes the absolute Expected Value (EV) of every available player action in real-time, relying only on visible cards.
- **FR6:** The system detects and flags actions possessing a negative EV relative to the mathematically optimal baseline.
- **FR7:** The system renders educational UI feedback outlining why a selected sub-optimal move is statistically detrimental.
- **FR8:** The system issues explicit bonus virtual currency when the user executes the mathematically optimal choice, regardless of the hand's subsequent randomized outcome.

### Display & Interaction Modes
- **FR13:** The system provides an Expert Mode toggle that switches the EV feedback display between a visual-only mode (color-coded glows and plain-language tooltips) and a data-rich mode (exact EV values, bust probabilities, and basic strategy notation).
- **FR14:** The Expert Mode preference persists across browser sessions.

### Onboarding & Compliance
- **FR15:** The system can present a guided onboarding sequence to first-time users, introducing the core game controls, the EV cheat-sheet, and the educational tooltip system before their first hand.
- **FR16:** The system can display a persistent, prominently visible educational disclaimer stating the application is for educational purposes only and does not involve real-money gambling.

### Dynamic Player Economy
- **FR9:** The system persists a user's virtual currency balance universally across browser sessions.
- **FR10:** The system gates player access sequentially to difficulty levels based on possessed virtual currency.
- **FR11:** The system actively detects bankrupt states to automatically route users to the "Free Play" rehabilitative loop.
- **FR12:** The system enforces a rigid ceiling limit on payouts generated in the rehabilitative level, matching exactly the entry cost of the standard gameplay level.

### Game Administration
- **FR17:** Administrators can dynamically manipulate the likelihood coefficient determining exactly how often Level 1 AI commits sub-optimal errors.
- **FR18:** Administrators can adjust key global variables (starting cash, EV bonus size, level entry fees, level-up threshold) via standard configuration without redeploying the core engine.

### Internationalization
- **FR19:** The system supports 4 languages (Français, Nederlands, English, Deutsch) with automatic browser language detection and a manual language switcher accessible from the game interface.

## Non-Functional Requirements (Quality Attributes)

### System Performance
- **NFR1:** All Expected Value background calculations must resolve and return data to the UI thread in under 50 milliseconds.
- **NFR2:** Hand resolution, tooltip rendering, and card animations must maintain 60 Frames Per Second (FPS) on a baseline modern mobile standard (e.g., iPhone 11 rendering capability).
- **NFR3:** The application's Time-to-Interactive (TTI) must not exceed 2.5 seconds on a generic 4G connection.

### Accessibility Standards
- **NFR4:** Card imagery, educational overlays, and vital text components must retain a 4.5:1 minimum contrast ratio.
- **NFR5:** Core operational loops (Hit, Stand, Double) must be entirely accessible via standard generic keyboard actions (Tab, Space, Enter) for desktop accessibility.

### Persistence Reliability
- **NFR6:** The local storage commit execution must trigger instantaneously upon hand resolution, preventing user progress degradation resulting from unexpected browser closure.

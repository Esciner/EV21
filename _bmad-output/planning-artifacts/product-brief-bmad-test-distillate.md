---
title: "Product Brief Distillate: bmad-test"
type: llm-distillate
source: "product-brief-bmad-test.md"
created: "2026-04-01T11:16:00Z"
purpose: "Token-efficient context for downstream PRD creation"
---

## Technical Context
*   **Web Framework:** JavaScript-based. Explicit preference for Vue.js or NuxtJS.
*   **UI Library:** Explicit preference for `nuxt-ui` to handle clean, modern interfaces and smooth card/chip animations.
*   **Data Persistence:** Requires a save system (local storage or lightweight backend) to maintain user virtual currency and level progress across sessions.

## Educational Mechanics & Gamification
*   **Expected Value (EV) Emphasis:** The core educational loop rewards choices that are mathematically optimal (Basic Strategy/EV-positive) rather than solely rewarding winning the hand.
*   **Decoupled Outcomes:** Players earn virtual currency for "good decisions" even if they lose the hand to bad luck, teaching variance and probability.
*   **Educational Tooltips:** The UI must actively explain mathematical errors in real-time. For example, if an AI or player hits on 19, the UI highlights the precise probability of bustling.

## Scope Signals & Game Progression
*   **In-Scope (MVP):** Single-player Blackjack game engine, progressive difficulty levels, save system, virtual economy, basic strategy teaching tools, "dumb" AI opponent.
*   **Out-of-Scope (MVP):** Real-money gambling, multiplayer features, advanced game theory (like card counting metrics) are explicitly deferred.
*   **Level 1 / Anti-Softlock:** A foundational "Free Play" mode against a mathematically flawed AI. It generates virtual currency without entry cost.
*   **Strict Return-to-Economy:** To preserve currency value, the Level 1 Free Play mode yields *exactly enough* currency to pay the entry fee for Level 2 (and nothing more), preventing hyperinflation of virtual dollars while avoiding frustrating soft-locks.
*   **User Progression Path:** Players start against an AI that makes explicit mathematical errors (explained via UI) to build confidence and bankroll, before facing standard casino rules.

## Audience Context
*   **Target Profile:** Beginners who want to improve at Blackjack but are also curious about the underlying probabilities and game theory. They need gamification to stay engaged with statistics.

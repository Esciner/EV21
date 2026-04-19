# Story 2.2: EV Feedback Overlay & Decision Celebration

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a player,
I want to see an immediate visual celebration when I make a mathematically optimal choice — BEFORE the cards are revealed,
So that I feel rewarded for the quality of my decision, not the randomness of the outcome.

## Acceptance Criteria

1. **Given** the player is in PLAYER_TURN phase and makes a decision (Hit/Stand/Double), **When** the decision matches the optimal EV action, **Then** the `EVFeedbackOverlay` fires a gold shimmer/confetti animation over the action area at 0ms (instant).
2. **And** action buttons briefly show a green glow state (EV-Positive).
3. **And** a toast notification appears: "Great call!" (via `$t('ev.positive_feedback')`).
4. **Given** the player makes a sub-optimal decision, **When** the action does NOT match the optimal EV action, **Then** the `EVFeedbackOverlay` fires a localized red warning glow (not full-screen — contained to the action area).
5. **And** an educational tooltip explains WHY the optimal play was different (via `$t()` i18n keys).
6. **And** the tooltip disappears automatically after 2 seconds or on tap.
7. **Given** the EV feedback has fired, **When** 500ms elapses (EV_FEEDBACK phase timer), **Then** the game transitions to DEALER_TURN and the dealer reveals their hidden card.
8. **And** animations maintain 60 FPS throughout the sequence (NFR2).

## Tasks / Subtasks

- [x] Task 1: Create `EVFeedbackOverlay` component (AC 1, AC 4)
  - [x] Implement the component in `app/components/game/EVFeedbackOverlay.vue`.
  - [x] Implement the gold shimmer/confetti animation using Tailwind CSS and scoped CSS for optimal choices.
  - [x] Implement localized red warning glow animation for sub-optimal choices.
- [x] Task 2: Implement Educational Tooltips & Notifications (AC 3, AC 5, AC 6)
  - [x] Integrate Nuxt UI toast notification or a custom overlay for the "Great call!" message using `$t('ev.positive_feedback')`.
  - [x] Implement an educational tooltip pointing to the optimal move explaining why it was better when a sub-optimal action is made, using i18n.
  - [x] Ensure the tooltip auto-dismisses after 2 seconds or on player tap.
- [x] Task 3: Integrate state transitions in `useGameStore` and Action Buttons (AC 2, AC 7)
  - [x] Before transitioning straight to `DEALER_TURN`, ensure the state machine enters `EV_FEEDBACK` phase.
  - [x] Wait for a 500ms timer during `EV_FEEDBACK` phase before progressing to `DEALER_TURN`.
  - [x] Propagate the EV-Positive/Negative state to the `CasinoActionButton` component to trigger the green or red button glow.
- [x] Task 4: Performance & Testing (AC 8)
  - [x] Ensure animations rely on CSS transforms (`scale`, `rotate`, `translate`, `opacity`) instead of layout-altering properties to maintain 60 FPS.
  - [x] Write component tests mounting `EVFeedbackOverlay.vue` to check if visual states and texts are rendered properly based on EV feedback props.

### Review Findings

- [x] [Review][Decision] **AC 5 — Explications contextuelles manquantes** — `assessAction()` utilise toujours `ev.explanation_generic` pour tous les cas suboptimaux. La spec AC 5 exige une explication « WHY the optimal play was different ». Choix requis : (A) Ajouter une logique contextuelle basée sur le total du joueur et la carte du dealer, ou (B) Accepter l'explication générique pour le MVP. [useGameStore.ts:95-104]
- [x] [Review][Decision] **Tooltip 2s vs. store cleanup 500ms** — Le tooltip dans `EVFeedbackOverlay` est configuré pour 2s, mais le store nettoie `evFeedback` après 500ms, ce qui détruit le composant via `v-if="actionType"`. Le tooltip ne sera jamais visible plus de 500ms. Choix requis : (A) Allonger le timer du store à 2500ms pour permettre le tooltip, ou (B) Réduire le tooltip à 400ms pour rester dans la fenêtre de 500ms. [EVFeedbackOverlay.vue:17-28, useGameStore.ts:111-116]
- [x] [Review][Patch] **Boutons cliquables pendant EV_FEEDBACK** — La logique `disabled` sur Hit/Stand/Double évalue `!isPlayerTurn && phase !== EV_FEEDBACK` → les boutons sont ACTIVÉS pendant EV_FEEDBACK. Le joueur peut déclencher une deuxième action avant la fin du timer de 500ms. La garde `if (phase !== PLAYER_TURN) return` dans le store bloque l'exécution mais le UX est confus. [game.vue:114-132]
- [x] [Review][Patch] **setTimeout non nettoyé dans `actWithFeedback`** — Le `setTimeout` de 500ms n'est ni storé ni annulé. Si le store est resetté (navigation) pendant le délai, le callback s'exécute sur un état potentiellement incohérent. [useGameStore.ts:111-116]
- [x] [Review][Patch] **Non-null assertion sur `dealerHandCards[0]`** — `assessAction` utilise `dealerHandCards.value[0]!` sans vérification préalable. Si appelé dans un état inattendu (cards vides), crash runtime. [useGameStore.ts:96]
- [x] [Review][Patch] **Split retourne toujours « suboptimal »** — `getOptimalAction()` peut retourner `'Split'` pour les paires, mais `assessAction` ne compare que Hit/Stand/Double. Toute paire où Split est optimal sera marquée suboptimale. [useGameStore.ts:98]
- [x] [Review][Patch] **Test manquant pour dismiss tooltip au clic** — AC 6 exige dismiss au tap. Le test vérifie le rendu mais pas l'interaction de dismiss. [EVFeedbackOverlay.nuxt.test.ts]
- [x] [Review][Patch] **Gardes redondantes dans hit/stand/double** — Chaque action vérifie `currentPhase !== PLAYER_TURN` puis appelle `actWithFeedback` qui vérifie la même chose. Supprimer la garde extérieure ou intérieure. [useGameStore.ts:119-151]
- [x] [Review][Defer] **Animation confetti en boucle infinie** — `confettiAnimation 1s linear infinite` tourne indéfiniment tant que le composant est monté. Mineur : le composant est détruit après 500ms. — deferred, pré-existant
- [x] [Review][Defer] **`useEvEngine()` dans Pinia store scope** — Le composable est appelé dans `defineStore()`. Si le composable dépend du contexte Nuxt, cela peut poser problème en SSR. Non causé par ce changement (SSR désactivé via `ssr: false`). — deferred, pré-existant

## Dev Notes

- **Architecture Rules to strictly follow:**
  - Game state is managed in `useGameStore`. The store handles phase transitions. Make sure `setTimeout` or reliable async waits handle the 500ms delay safely without race conditions.
  - UI components for the game board belong in `app/components/game/`.
  - Animations must strictly use GPU-accelerated CSS properties (like `opacity` and `transform`) to guarantee NFR2 (60 FPS on mobile).
  - Use `@nuxtjs/i18n` with `$t('key')` for ALL user-facing strings. Add the necessary keys to the locale files (`i18n/locales/*.json`) if they don't exist yet!
- **Previous Story Intelligence:**
  - `useEvEngine` was added in 2.1. Extract its computed values to evaluate if the player's action was the optimal EV action.
  - Follow the existing zero layout shift rules observed in Epic 1. Tools and animations must render `absolute`ly or within fixed flex containers so they do not displace other UI elements.
- **Testing:**
  - Unit tests for the new component must be added. Remember to test both positive and negative action states.

### Project Structure Notes

- `app/components/game/EVFeedbackOverlay.vue` [NEW]
- `tests/components/EVFeedbackOverlay.nuxt.test.ts` [NEW]
- `app/components/game/CasinoActionButton.vue` [MODIFY]
- `app/stores/useGameStore.ts` [MODIFY]
- `i18n/locales/*.json` [MODIFY]

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2]
- [Source: _bmad-output/planning-artifacts/epics.md#UX-DR5]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

- Implemented `EVFeedbackOverlay` component using Tailwind and pure CSS for gold shimmer, confetti, and red glow animations to maintain 60 FPS without layout shifts.
- Implemented state transitions in `useGameStore` to evaluate player action against the EV Engine and trigger `EV_FEEDBACK` phase.
- Added a 500ms delay to all actions (Hit, Stand, Double) during the `EV_FEEDBACK` phase to show visual evaluations.
- Updated `CasinoActionButton` to visually react (green/red glow) to the optimal or suboptimal state.
- Integrated i18n keys for educational text and feedback messages in both English and French.
- Ensured unit tests were written and updated before implementation, satisfying TDD workflows.

### File List

- `app/components/game/EVFeedbackOverlay.vue` [NEW]
- `tests/components/EVFeedbackOverlay.nuxt.test.ts` [NEW]
- `app/components/game/CasinoActionButton.vue` [MODIFY]
- `app/stores/useGameStore.ts` [MODIFY]
- `app/stores/useGameStore.test.ts` [MODIFY]
- `app/pages/game.vue` [MODIFY]
- `i18n/locales/en.json` [MODIFY]
- `i18n/locales/fr.json` [MODIFY]
- `_bmad-output/implementation-artifacts/sprint-status.yaml` [MODIFY]

# Résumé d'Automatisation des Tests (Test Automation Summary)

## Tests Générés et Mis à Jour

### E2E Tests (Playwright)
- [x] `tests/e2e/game.spec.ts` - Validation de l'affichage initial de la table de Blackjack, de la fonctionnalité pour distribuer les cartes (`BmadCard.vue`), et de la persistance de l'état du solde du joueur.

## Couverture (Coverage)
- L'affichage layout et la vérification des zones "Dealer" et "Player" sont testés en E2E.
- Le cycle de début de jeu (Cliquer "DEAL CARDS" et vérifier l'affichage des actions contextuelles "HIT / STAND / RESET") est testé.
- La robustesse de la page vis-à-vis des rechargements asynchrones liés au solde (vérification renforcée via le symbole 🪙 au lieu de `1000` hardcodé) est testée.

## Prochaines Étapes (Next Steps)
- Exécuter la suite dans un pipeline CI/CD (GitHub Actions).
- Ajouter des cas plus avancés pour la séquence "HIT" et "STAND" ou la gestion complète des gains/pertes.

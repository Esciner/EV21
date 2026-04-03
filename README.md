# EV21 ♠️

> A premium open-source simulator to learn Blackjack and master Expected Value (EV) decision-making.

EV21 is an educational, open-source application designed to teach players the underlying mathematics of Blackjack. Instead of relying on luck, EV21 surfaces the **Expected Value** of every possible action (Hit, Stand, Double) in real-time, helping you develop an infallible playing instinct.

## 🌟 Key Features

*   **Expected Value (EV) Pedagogy Engine:** Get instant, mathematical feedback on your decisions before the dealer's cards are revealed.
*   **Casino Dark Aesthetic:** A premium, immersive interface built around modern standards using Tailwind CSS.
*   **Dynamic Dealer AI:** Practice against standard rules, or train against a forgiving level 1 dealer that occasionally makes mathematical errors.
*   **Expert Mode:** Toggle between visual-only cues and a data-rich mathematical display (raw EV thresholds, bust probability).
*   **100% Client-Side Simulation:** Ultra-fast resolution loop backed by Pinia state management.

## 🛠️ Technology Stack

*   **Framework:** [Nuxt 4](https://nuxt.com/) (Vue 3)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **State Management:** [Pinia](https://pinia.vuejs.org/)
*   **Localization (i18n):** English, Français, Deutsch, Nederlands
*   **Testing:** [Playwright E2E](https://playwright.dev/) & [Vitest](https://vitest.dev/)

## 🚀 Quick Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

### Production Build

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

## 🧪 Testing

EV21 includes an extensive testing suite covering the internal economy, configuration stores, and the complete end-to-end user navigation via Playwright.

```bash
# Run unit tests
npm run test

# Run E2E tests (Requires Playwright browsers)
npx playwright test
```

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---
title: "Product Brief: bmad-test (Blackjack Game Theory App)"
status: "complete"
created: "2026-04-01T11:05:00Z"
updated: "2026-04-01T11:15:00Z"
inputs: ["User discovery conversation", "Web research on blackjack game theory"]
---

# Product Brief: Blackjack Game Theory App

## Executive Summary
This project is an educational web application that uses the game of Blackjack as a Trojan horse to teach beginners the fundamentals of probability and game theory. Built using modern web technologies, the application gamifies the learning experience. Rather than a standard casino simulator, it introduces players to concepts like Expected Value (EV) and Basic Strategy through leveled progression. The goal is to safely build intuition for statistical decision-making in a fun, risk-free environment.

## The Problem
Game theory and probability are often taught through dry, academic examples that fail to engage beginners. Conversely, casino games are culturally popular but often misunderstood, leading people to rely on "gut feeling" rather than mathematical reality. There is a missing bridge: an accessible, interactive tool that demonstrates how mathematical modeling directly influences outcomes in a familiar, engaging scenario.

## The Solution
A web-based Blackjack game designed explicitly for education. The application acts as a digital tutor, where players progress through levels that gradually introduce game theory concepts. It features a virtual economy where players earn faux currency by making mathematically sound decisions, not just by winning hands. A robust save system ensures persistence, allowing players to build their skills over time without the frustration of soft-locking.

## The Educational Experience (What Makes This Different)
Unlike standard gambling apps that exist to simulate a casino, this application is a learning environment:
*   **Decoupled Outcomes and Decisions:** The core educational loop rewards players for making the mathematically optimal choice (highest Expected Value), even if bad luck causes them to lose the hand. This teaches that good process is more important than short-term results.
*   **Gamified Progression:** Players start in a basic tier (e.g., competing against a "dumb" AI). The game highlights *why* the AI's moves are mathematically terrible, providing immediate, contextual learning before gradually increasing the difficulty.
*   **Anti-Softlock Mechanism:** If a player runs out of virtual money, they can retreat to a "Free Play" beginner mode. Winning here rewards them with *just enough* virtual currency to re-enter Level 2, maintaining the stakes and value of the game's economy while preventing total failure.

## Target Users
**The Curious Beginner:** Individuals who want to improve their blackjack skills but are ultimately interested in understanding the "why" behind the strategy. They are open to learning about probabilities and game theory if it is presented in an engaging, applied manner.

## Scope (MVP)
The first iteration will focus on a tight, polished core loop:
*   **Core Game Engine:** A fully functional, single-player Blackjack system.
*   **Progressive Difficulty System:** A minimal set of levels introducing basic concepts, starting with an intentionally flawed AI opponent.
*   **Persistent Data:** A save system to track virtual currency and level progress.
*   **UI/UX:** A clean, modern interface featuring smooth animations for card dealing, chip movements, and educational tooltips explaining mathematical errors or optimal choices.
*   **Economy Engine:** A system capable of rewarding "optimal play" separately from "winning hands", including the specific Level 2 re-entry constraint.
*   *(Note: Advanced topics like card counting or multiplayer are explicitly out of scope for the MVP).*

## Vision
If successful, the app becomes a scalable platform for applied game theory. Future iterations could include detailed analytical dashboards, post-game breakdowns of Expected Value missed, advanced meta-game concepts (like bankroll management), and interactive lessons that break down the math behind specific hands.

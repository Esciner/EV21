import { defineStore } from 'pinia';
import { GamePhase } from '../types/game';
import type { Card } from '../types/game';

export const useGameStore = defineStore('game', {
  state: () => ({
    currentPhase: GamePhase.IDLE,
    playerHand: [] as Card[],
    dealerHand: [] as Card[],
    deck: [] as Card[],
    currentBet: 0,
    result: null as string | null
  }),

  actions: {
    setPhase(phase: GamePhase) {
      this.currentPhase = phase;
    },
    setBet(amount: number) {
      this.currentBet = amount;
    },
    resetHand() {
      this.playerHand = [];
      this.dealerHand = [];
      this.result = null;
    },
    resetStore() {
      this.currentPhase = GamePhase.IDLE;
      this.playerHand = [];
      this.dealerHand = [];
      this.deck = [];
      this.currentBet = 0;
      this.result = null;
    }
  }
});

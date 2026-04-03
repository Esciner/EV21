import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGameStore } from './useGameStore';
import { GamePhase } from '../types/game';

describe('useGameStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with IDLE phase', () => {
    const store = useGameStore();
    expect(store.currentPhase).toBe(GamePhase.IDLE);
    expect(store.playerHand).toEqual([]);
    expect(store.dealerHand).toEqual([]);
  });

  it('should transition phases correctly', () => {
    const store = useGameStore();
    store.setPhase(GamePhase.BETTING);
    expect(store.currentPhase).toBe(GamePhase.BETTING);
    
    store.setPhase(GamePhase.DEALING);
    expect(store.currentPhase).toBe(GamePhase.DEALING);
  });

  it('should reset store correctly', () => {
    const store = useGameStore();
    store.setPhase(GamePhase.PLAYER_TURN);
    store.playerHand = [{ suit: 'hearts', rank: 'A', value: 11, isFaceUp: true }];
    store.currentBet = 100;
    
    store.resetStore();
    
    expect(store.currentPhase).toBe(GamePhase.IDLE);
    expect(store.playerHand).toEqual([]);
    expect(store.currentBet).toBe(0);
  });
});

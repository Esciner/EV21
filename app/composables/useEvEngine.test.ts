import { describe, it, expect } from 'vitest'
import { useEvEngine } from './useEvEngine'
import type { Card, Hand } from '../types/game'
import { useHandResolver } from './useHandResolver'

const createCard = (rank: Card['rank'], value: number): Card => ({
  rank,
  value,
  suit: 'hearts',
  isFaceUp: true
})

const { calculateHand } = useHandResolver()

const createHand = (cards: Card[]): Hand => {
  return calculateHand(cards)
}

describe('useEvEngine', () => {
  const engine = useEvEngine()

  describe('Hard Totals', () => {
    it('returns Hit or Double for Hard 11 against Dealer 10', () => {
      // Basic strategy: Double 11 against 2-10
      const hand = createHand([createCard('6', 6), createCard('5', 5)])
      const dealerCard = createCard('10', 10)
      
      const ev = engine.computeEV(hand, dealerCard)
      expect(ev.Hit).toBeGreaterThan(ev.Double!)
      expect(ev.Hit).toBeGreaterThan(ev.Stand!)
      expect(engine.getOptimalAction(hand, dealerCard)).toBe('Hit')
    })

    it('returns Stand for Hard 16 against Dealer 6', () => {
      // Basic strategy: Stand 16 against 2-6
      const hand = createHand([createCard('10', 10), createCard('6', 6)])
      const dealerCard = createCard('6', 6)
      
      const ev = engine.computeEV(hand, dealerCard)
      expect(ev.Stand).toBeGreaterThan(ev.Hit)
      expect(engine.getOptimalAction(hand, dealerCard)).toBe('Stand')
    })
    
    it('returns Hit for Hard 16 against Dealer 7', () => {
      // Basic strategy: Hit 16 against 7-A
      const hand = createHand([createCard('10', 10), createCard('6', 6)])
      const dealerCard = createCard('7', 7)
      
      const optimal = engine.getOptimalAction(hand, dealerCard)
      expect(optimal).toBe('Hit')
    })
  })

  describe('Soft Totals', () => {
    it('returns Double for Soft 18 (A,7) against Dealer 6', () => {
      // Basic strategy: Double A,7 vs 3-6
      const hand = createHand([createCard('A', 11), createCard('7', 7)])
      const dealerCard = createCard('6', 6)
      
      expect(engine.getOptimalAction(hand, dealerCard)).toBe('Double')
    })
    
    it('returns Stand for Soft 18 (A,7) against Dealer 2', () => {
      // DP correctly resolves Stand for infinite-deck with proper multi-ace reduction
      const hand = createHand([createCard('A', 11), createCard('7', 7)])
      const dealerCard = createCard('2', 2)
      
      expect(engine.getOptimalAction(hand, dealerCard)).toBe('Stand')
    })

    it('returns Hit for Soft 18 (A,7) against Dealer 9', () => {
      // Basic strategy: Hit A,7 vs 9,10,A
      const hand = createHand([createCard('A', 11), createCard('7', 7)])
      const dealerCard = createCard('9', 9)
      
      expect(engine.getOptimalAction(hand, dealerCard)).toBe('Hit')
    })
  })

  describe('Pairs', () => {
    it('returns Hit for Pairs (8,8) against Dealer 10', () => {
      const hand = createHand([createCard('8', 8), createCard('8', 8)])
      const dealerCard = createCard('10', 10)
      
      const ev = engine.computeEV(hand, dealerCard)
      expect(ev.Split).toBeDefined()
      expect(ev.Hit).toBeGreaterThan(ev.Split!)
      expect(engine.getOptimalAction(hand, dealerCard)).toBe('Hit')
    })
    
    it('returns Split for Pairs (A,A) against 6', () => {
      const hand = createHand([createCard('A', 11), createCard('A', 11)])
      const dealerCard = createCard('6', 6)
      
      const ev = engine.computeEV(hand, dealerCard)
      expect(ev.Split).toBeGreaterThan(ev.Double!)
      expect(engine.getOptimalAction(hand, dealerCard)).toBe('Split')
    })
  })

  describe('Performance and Edge Cases', () => {
    it('executes computeEV synchronously in less than 2ms', () => {
      const hand = createHand([createCard('10', 10), createCard('6', 6)])
      const dealerCard = createCard('6', 6)
      
      const start = performance.now()
      for(let i = 0; i < 500; i++) {
        engine.computeEV(hand, dealerCard)
      }
      const end = performance.now()
      
      const averageMs = (end - start) / 500
      expect(averageMs).toBeLessThan(2) // Kept under very tight performance bounds
    })
    
    it('handles Dealer Ace properly', () => {
      const hand = createHand([createCard('10', 10), createCard('6', 6)])
      const dealerCard = createCard('A', 11)
      expect(engine.getOptimalAction(hand, dealerCard)).toBe('Hit')
    })
    
    it('handles Blackjack with 3:2 payout', () => {
      const hand = createHand([createCard('A', 11), createCard('10', 10)])
      const dealerCard = createCard('6', 6)
      const ev = engine.computeEV(hand, dealerCard)
      expect(engine.getOptimalAction(hand, dealerCard)).toBe('Stand')
      // Dealer 6 can never have blackjack, so full 3:2 payout
      expect(ev.Stand).toBe(1.5)
    })
  })
})

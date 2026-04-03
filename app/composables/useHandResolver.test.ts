import { describe, it, expect } from 'vitest'
import { useHandResolver } from './useHandResolver'
import type { Card, Hand } from '../types/game'

describe('useHandResolver', () => {
  const { calculateHand, computeWinner } = useHandResolver()

  const createCard = (rank: any, value: number): Card => ({
    suit: 'hearts',
    rank,
    value,
    isFaceUp: true
  })

  describe('calculateHand', () => {
    it('calculates value without aces correctly', () => {
      const hand = calculateHand([
        createCard('10', 10),
        createCard('7', 7)
      ])
      expect(hand.total).toBe(17)
      expect(hand.isSoft).toBe(false)
      expect(hand.isBust).toBe(false)
    })

    it('calculates single ace correctly (soft 17)', () => {
      const hand = calculateHand([
        createCard('A', 11),
        createCard('6', 6)
      ])
      expect(hand.total).toBe(17)
      expect(hand.isSoft).toBe(true)
      expect(hand.isBust).toBe(false)
    })

    it('calculates ace acting as 1 correctly', () => {
      const hand = calculateHand([
        createCard('10', 10),
        createCard('6', 6),
        createCard('A', 11)
      ])
      expect(hand.total).toBe(17)
      expect(hand.isSoft).toBe(false)
      expect(hand.isBust).toBe(false)
    })

    it('calculates multiple aces correctly', () => {
      const hand = calculateHand([
        createCard('A', 11),
        createCard('A', 11)
      ])
      expect(hand.total).toBe(12) // 11 + 1
      expect(hand.isSoft).toBe(true)
      expect(hand.isBust).toBe(false)
    })

    it('busts correctly', () => {
      const hand = calculateHand([
        createCard('10', 10),
        createCard('8', 8),
        createCard('5', 5)
      ])
      expect(hand.total).toBe(23)
      expect(hand.isSoft).toBe(false)
      expect(hand.isBust).toBe(true)
    })
  })

  describe('computeWinner', () => {
    const createHand = (cards: Card[]): Hand => calculateHand(cards)
    
    it('player busts -> dealer wins', () => {
      const player = createHand([createCard('10', 10), createCard('10', 10), createCard('5', 5)])
      const dealer = createHand([createCard('10', 10), createCard('6', 6)])
      expect(computeWinner(player, dealer)).toBe('dealer-win')
    })
    
    it('player has blackjack -> player-blackjack', () => {
      const player = createHand([createCard('A', 11), createCard('K', 10)])
      const dealer = createHand([createCard('10', 10), createCard('6', 6)])
      expect(computeWinner(player, dealer)).toBe('player-blackjack')
    })
    
    it('both have blackjack -> push', () => {
      const player = createHand([createCard('A', 11), createCard('K', 10)])
      const dealer = createHand([createCard('A', 11), createCard('Q', 10)])
      expect(computeWinner(player, dealer)).toBe('push')
    })
    
    it('dealer busts -> player wins', () => {
      const player = createHand([createCard('10', 10), createCard('6', 6)])
      const dealer = createHand([createCard('10', 10), createCard('10', 10), createCard('5', 5)])
      expect(computeWinner(player, dealer)).toBe('player-win')
    })
    
    it('player has higher total -> player wins', () => {
      const player = createHand([createCard('10', 10), createCard('9', 9)])
      const dealer = createHand([createCard('10', 10), createCard('8', 8)])
      expect(computeWinner(player, dealer)).toBe('player-win')
    })
    
    it('dealer has higher total -> dealer wins', () => {
      const player = createHand([createCard('10', 10), createCard('8', 8)])
      const dealer = createHand([createCard('10', 10), createCard('9', 9)])
      expect(computeWinner(player, dealer)).toBe('dealer-win')
    })
    
    it('same total -> push', () => {
      const player = createHand([createCard('10', 10), createCard('8', 8)])
      const dealer = createHand([createCard('10', 10), createCard('8', 8)])
      expect(computeWinner(player, dealer)).toBe('push')
    })
  })
})

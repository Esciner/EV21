import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { watch } from 'vue'
import { useGameStore } from './useGameStore'
import { useConfigStore } from './useConfigStore'
import { useEconomyStore } from './useEconomyStore'
import { GamePhase } from '../types/game'
import type { Card } from '../types/game'

// Helper to create deterministic cards
const makeCard = (rank: string, value: number, suit = 'hearts', faceUp = true): Card => ({
  suit: suit as Card['suit'],
  rank: rank as Card['rank'],
  value,
  isFaceUp: faceUp
})

// Mock useDeck to return deterministic cards
vi.mock('../composables/useDeck', () => ({
  useDeck: () => {
    let cards: Card[] = []
    return {
      deck: { value: cards },
      shuffle: () => {
        // Stack: player1, dealer1, player2, dealer2, hit/double card, dealer-hit cards...
        // Cards are popped (LIFO), so we push in reverse order
        cards = [
          makeCard('7', 7, 'clubs'), // Extra dealer hit card (if needed)
          makeCard('6', 6, 'clubs'), // Extra dealer hit card (16 -> hit)
          makeCard('5', 5, 'spades'), // Card 5: hit/double card for player
          makeCard('K', 10, 'diamonds'), // Card 4: dealer hole card (face-down)
          makeCard('8', 8, 'hearts'), // Card 3: player second card
          makeCard('6', 6, 'clubs'), // Card 2: dealer up card
          makeCard('9', 9, 'hearts') // Card 1: player first card
        ]
      },
      drawCard: (faceUp: boolean) => {
        if (cards.length === 0) throw new Error('Deck is empty')
        const card = cards.pop()!
        card.isFaceUp = faceUp
        return card
      }
    }
  }
}))

describe('useGameStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with default state', () => {
    const store = useGameStore()
    expect(store.currentPhase).toBe(GamePhase.IDLE)
    expect(store.playerHandCards.length).toBe(0)
    expect(store.dealerHandCards.length).toBe(0)
  })

  it('deals cards correctly and enters PLAYER_TURN', () => {
    const store = useGameStore()
    store.deal()

    // Player: 9♥ + 8♥ = 17, Dealer: 6♣ + K♦(hidden)
    expect(store.playerHandCards.length).toBe(2)
    expect(store.dealerHandCards.length).toBe(2)

    expect(store.playerHandCards[0]!.isFaceUp).toBe(true)
    expect(store.playerHandCards[1]!.isFaceUp).toBe(true)

    expect(store.dealerHandCards[0]!.isFaceUp).toBe(true)
    expect(store.dealerHandCards[1]!.isFaceUp).toBe(false)

    expect(store.currentPhase).toBe(GamePhase.PLAYER_TURN)
    expect(store.playerHand.total).toBe(17)
  })

  it('transitions through BETTING phase during deal', () => {
    const store = useGameStore()
    // Track phase transitions via watching reactive state
    const phases: GamePhase[] = []
    watch(() => store.currentPhase, (newPhase) => {
      phases.push(newPhase)
    }, { flush: 'sync' })
    store.deal()
    expect(phases).toContain(GamePhase.BETTING)
    expect(phases).toContain(GamePhase.DEALING)
    expect(phases).toContain(GamePhase.PLAYER_TURN)
    expect(store.currentPhase).toBe(GamePhase.PLAYER_TURN)
  })

  it('only allows deal from IDLE or PAYOUT', () => {
    const store = useGameStore()
    store.deal() // IDLE -> PLAYER_TURN

    const cardsBefore = store.playerHandCards.length
    store.deal() // Should be rejected — we are in PLAYER_TURN
    expect(store.playerHandCards.length).toBe(cardsBefore) // No change
    expect(store.currentPhase).toBe(GamePhase.PLAYER_TURN)
  })

  it('processes hit correctly (no bust)', () => {
    const store = useGameStore()
    store.deal()
    // Player: 9♥ + 8♥ = 17
    store.hit()
    expect(store.currentPhase).toBe(GamePhase.EV_FEEDBACK)
    expect(store.evFeedbackAction).toBe('Hit')
    vi.advanceTimersByTime(2500)
    
    // Player gets 5♠ -> 17 + 5 = 22 -> BUST
    expect(store.playerHandCards.length).toBe(3)
    expect(store.playerHand.total).toBe(22)
    expect(store.playerHand.isBust).toBe(true)
    expect(store.currentPhase).toBe(GamePhase.PAYOUT)
    expect(store.result).toBe('dealer-win')
  })

  it('processes stand correctly and finishes hand', () => {
    const store = useGameStore()
    store.deal()
    // Player: 17, Dealer: 6♣ + K♦ = 16 -> dealer must hit
    store.stand()
    expect(store.currentPhase).toBe(GamePhase.EV_FEEDBACK)
    expect(store.evFeedbackAction).toBe('Stand')
    vi.advanceTimersByTime(2500)

    expect(store.dealerHandCards[1]!.isFaceUp).toBe(true)
    expect(store.currentPhase).toBe(GamePhase.PAYOUT)
    expect(store.dealerHand.total).toBeGreaterThanOrEqual(17)
  })

  it('processes double correctly', () => {
    const store = useGameStore()
    store.deal()
    // Set bet AFTER deal (deal resets currentBet)
    store.setBet(100)
    // Player: 9♥ + 8♥ = 17, gets 5♠ -> 22 -> BUST
    store.double()
    expect(store.currentPhase).toBe(GamePhase.EV_FEEDBACK)
    expect(store.evFeedbackAction).toBe('Double')
    vi.advanceTimersByTime(2500)

    expect(store.currentBet).toBe(200)
    expect(store.playerHandCards.length).toBe(3)
    expect(store.playerHand.total).toBe(22)
    expect(store.playerHand.isBust).toBe(true)
    expect(store.currentPhase).toBe(GamePhase.PAYOUT)
    expect(store.result).toBe('dealer-win')
  })

  it('resets currentBet on new deal', () => {
    const store = useGameStore()
    store.setBet(100)
    store.deal()
    store.stand() // Finish hand -> PAYOUT
    vi.advanceTimersByTime(2500)

    // Deal again from PAYOUT (new hand started with whatever bet was submitted via setBet right before deal)
    store.deal()
    expect(store.currentBet).toBe(100) // Bet must persist through the hand!
  })

  describe('EV Bonus Currency System', () => {
    beforeEach(() => {
      const configStore = useConfigStore()
      configStore.config = {
        startingBalance: 1000,
        levelEntryFee: 0,
        levelUpThreshold: 10000,
        evBonusMultiplier: 0.3,
        level1AiErrorRate: 0,
        rehabPayoutCap: 200
      }
      
      const economyStore = useEconomyStore()
      economyStore.balance = 1000
    })

    it('awards EV bonus on optimal play', () => {
      const gameStore = useGameStore()
      const economyStore = useEconomyStore()
      
      gameStore.setBet(100)
      gameStore.deal() // Player 17, dealer 6 up
      
      gameStore.stand() 
      vi.advanceTimersByTime(2500) // Finish feedback and dealer turn

      expect(gameStore.currentPhase).toBe(GamePhase.PAYOUT)
      expect(gameStore.evBonusAmount).toBe(30) // 100 * 0.3
    })

    it('calculates differential EV bonus on suboptimal play', () => {
      const gameStore = useGameStore()
      const economyStore = useEconomyStore()
      
      gameStore.setBet(100)
      gameStore.deal() // Player 17, dealer 6 up
      
      // Hit is severely suboptimal here. Penalty is high enough to reduce EV bonus to 0.
      gameStore.hit()
      vi.advanceTimersByTime(2500)
      
      expect(gameStore.currentPhase).toBe(GamePhase.PAYOUT)
      expect(gameStore.evBonusAmount).toBe(0)
    })
    
    it('resets evBonusAmount on new deal', () => {
      const gameStore = useGameStore()
      gameStore.evBonusAmount = 50
      
      gameStore.deal()
      
      expect(gameStore.evBonusAmount).toBe(0)
    })
  })
})

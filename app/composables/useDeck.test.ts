import { describe, it, expect } from 'vitest'
import { useDeck } from './useDeck'

describe('useDeck', () => {
  it('initializes with a full deck of 52 cards', () => {
    const { deck } = useDeck()
    expect(deck.value).toHaveLength(52)
  })

  it('draws a card and sets face-up state correctly', () => {
    const { deck, drawCard } = useDeck()
    const initialDeckLength = deck.value.length
    
    // Draw face down
    const card1 = drawCard(false)
    expect(card1).toBeDefined()
    expect(card1.isFaceUp).toBe(false)
    expect(deck.value.length).toBe(initialDeckLength - 1)

    // Draw face up
    const card2 = drawCard(true)
    expect(card2.isFaceUp).toBe(true)
    expect(deck.value.length).toBe(initialDeckLength - 2)
  })

  it('throws an error when drawing from an empty deck', () => {
    const { deck, drawCard } = useDeck()
    // draw all 52 cards
    for (let i = 0; i < 52; i++) {
        drawCard()
    }
    expect(deck.value).toHaveLength(0)
    expect(() => drawCard()).toThrowError('Deck is empty')
  })

  it('can shuffle and reset the deck back to 52 cards', () => {
    const { deck, drawCard, shuffle } = useDeck()
    drawCard()
    drawCard()
    expect(deck.value.length).toBe(50)

    shuffle()
    expect(deck.value.length).toBe(52)
  })
})

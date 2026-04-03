import { ref } from 'vue'
import type { Card, Suit, Rank } from '../types/game'

export const useDeck = () => {
  const deck = ref<Card[]>([])

  const shuffle = () => {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
    const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    
    const newDeck: Card[] = []
    
    for (const suit of suits) {
      for (const rank of ranks) {
        let value = 0
        if (rank === 'A') value = 11
        else if (['J', 'Q', 'K'].includes(rank)) value = 10
        else value = parseInt(rank, 10)
        
        newDeck.push({
          suit,
          rank,
          value,
          isFaceUp: false
        })
      }
    }
    
    // Fisher-Yates shuffle
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newDeck[i]!;
      newDeck[i] = newDeck[j]!;
      newDeck[j] = temp;
    }
    
    deck.value = newDeck
  }

  const drawCard = (faceUp: boolean = true): Card => {
    if (deck.value.length === 0) {
      throw new Error('Deck is empty')
    }
    const card = deck.value.pop()!
    card.isFaceUp = faceUp
    return card
  }

  // Initialize on creation
  shuffle()

  return {
    deck,
    shuffle,
    drawCard
  }
}

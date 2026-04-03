import type { Card, Hand } from '../types/game'

export type GameResult = 'player-win' | 'dealer-win' | 'push' | 'player-blackjack'

export const useHandResolver = () => {
  const calculateHand = (cards: Card[]): Hand => {
    let total = 0
    let aces = 0
    
    for (const card of cards) {
      if (card.rank === 'A') {
        aces += 1
      } else {
        total += card.value
      }
    }
    
    let isSoft = false
    if (aces > 0) {
      if (total + 11 + (aces - 1) <= 21) {
        total += 11 + (aces - 1)
        isSoft = true
      } else {
        total += aces
      }
    }
    
    return {
      cards: [...cards],
      total,
      isSoft,
      isBust: total > 21
    }
  }

  const computeWinner = (playerHand: Hand, dealerHand: Hand): GameResult => {
    if (playerHand.isBust) {   
      return 'dealer-win'
    }
    
    const isBlackjack = (hand: Hand) => hand.total === 21 && hand.cards.length === 2
    
    const playerBlackjack = isBlackjack(playerHand)
    const dealerBlackjack = isBlackjack(dealerHand)
    
    if (playerBlackjack && dealerBlackjack) {
      return 'push'
    }
    if (playerBlackjack) {
      return 'player-blackjack'
    }
    if (dealerHand.isBust) {
      return 'player-win'
    }
    if (dealerBlackjack) {
      return 'dealer-win'
    }
    
    if (playerHand.total > dealerHand.total) {
      return 'player-win'
    } else if (playerHand.total < dealerHand.total) {
      return 'dealer-win'
    }
    
    return 'push'
  }

  return {
    calculateHand,
    computeWinner
  }
}

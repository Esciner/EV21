import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { GamePhase } from '../types/game'
import type { Card } from '../types/game'
import { useDeck } from '../composables/useDeck'
import { useHandResolver } from '../composables/useHandResolver'

export const useGameStore = defineStore('game', () => {
  const currentPhase = ref(GamePhase.IDLE)
  const playerHandCards = ref<Card[]>([])
  const dealerHandCards = ref<Card[]>([])
  const currentBet = ref(0)
  const result = ref<string | null>(null)

  const deckParams = useDeck()
  const resolver = useHandResolver()

  const playerHand = computed(() => resolver.calculateHand(playerHandCards.value))
  const dealerHand = computed(() => resolver.calculateHand(dealerHandCards.value))

  const setPhase = (phase: GamePhase) => {
    currentPhase.value = phase
  }

  const setBet = (amount: number) => {
    currentBet.value = amount
  }

  const resetHand = () => {
    playerHandCards.value = []
    dealerHandCards.value = []
    result.value = null
  }

  const resetStore = () => {
    currentPhase.value = GamePhase.IDLE
    resetHand()
    currentBet.value = 0
  }

  const deal = () => {
    if (currentPhase.value !== GamePhase.IDLE && currentPhase.value !== GamePhase.PAYOUT) return

    resetHand()
    currentBet.value = 0

    // Transition through BETTING phase (transient — Story 1-4 will add UI interaction here)
    setPhase(GamePhase.BETTING)
    setPhase(GamePhase.DEALING)
    
    deckParams.shuffle()
    playerHandCards.value.push(deckParams.drawCard(true))
    dealerHandCards.value.push(deckParams.drawCard(true))
    playerHandCards.value.push(deckParams.drawCard(true))
    dealerHandCards.value.push(deckParams.drawCard(false))

    setPhase(GamePhase.PLAYER_TURN)
  }

  const resolveHand = () => {
    setPhase(GamePhase.RESOLVING)
    
    // Ensure dealer hidden card is revealed
    if (dealerHandCards.value.length >= 2) {
      dealerHandCards.value[1]!.isFaceUp = true
    }

    result.value = resolver.computeWinner(playerHand.value, dealerHand.value)
    
    setPhase(GamePhase.PAYOUT)
  }

  const executeDealerTurn = () => {
    setPhase(GamePhase.DEALER_TURN)
    
    // Reveal hidden card
    if (dealerHandCards.value.length >= 2) {
      dealerHandCards.value[1]!.isFaceUp = true
    }
    
    // Hit on 16, stand on 17
    while (dealerHand.value.total < 17) {
      dealerHandCards.value.push(deckParams.drawCard(true))
    }

    resolveHand()
  }

  const hit = () => {
    if (currentPhase.value !== GamePhase.PLAYER_TURN) return

    playerHandCards.value.push(deckParams.drawCard(true))
    
    if (playerHand.value.isBust) {
      resolveHand()
    }
  }

  const stand = () => {
    if (currentPhase.value !== GamePhase.PLAYER_TURN) return
    executeDealerTurn()
  }

  const double = () => {
    if (currentPhase.value !== GamePhase.PLAYER_TURN || playerHandCards.value.length !== 2) return
    
    currentBet.value *= 2
    playerHandCards.value.push(deckParams.drawCard(true))
    
    if (playerHand.value.isBust) {
      resolveHand()
    } else {
      executeDealerTurn()
    }
  }

  return {
    currentPhase,
    playerHandCards,
    dealerHandCards,
    currentBet,
    result,
    playerHand,
    dealerHand,
    setPhase,
    setBet,
    resetHand,
    resetStore,
    deal,
    hit,
    stand,
    double
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { GamePhase } from '../types/game'
import type { Card } from '../types/game'
import { useDeck } from '../composables/useDeck'
import { useHandResolver } from '../composables/useHandResolver'
import { useEvEngine } from '../composables/useEvEngine'

export const useGameStore = defineStore('game', () => {
  const currentPhase = ref(GamePhase.IDLE)
  const playerHandCards = ref<Card[]>([])
  const dealerHandCards = ref<Card[]>([])
  const currentBet = ref(0)
  const result = ref<string | null>(null)
  
  const evFeedbackAction = ref<'Hit'|'Stand'|'Double'|'Split'|null>(null)
  const evFeedback = ref<'optimal'|'suboptimal'|null>(null)
  const evExplanation = ref<string>('')
  let feedbackTimeoutId: ReturnType<typeof setTimeout> | null = null

  const deckParams = useDeck()
  const resolver = useHandResolver()
  const evEngine = useEvEngine()

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

  const clearFeedback = () => {
    if (feedbackTimeoutId) {
      clearTimeout(feedbackTimeoutId)
      feedbackTimeoutId = null
    }
    evFeedbackAction.value = null
    evFeedback.value = null
    evExplanation.value = ''
  }

  const resetStore = () => {
    clearFeedback()
    currentPhase.value = GamePhase.IDLE
    resetHand()
    currentBet.value = 0
  }

  const deal = () => {
    if (currentPhase.value !== GamePhase.IDLE && currentPhase.value !== GamePhase.PAYOUT) return

    resetHand()
    currentBet.value = 0
    clearFeedback()

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

  const assessAction = (action: 'Hit'|'Stand'|'Double') => {
    const dealerCard = dealerHandCards.value[0]
    if (!dealerCard) return

    const optimal = evEngine.getOptimalAction(playerHand.value, dealerCard)
    evFeedbackAction.value = action

    // Split is not playable yet — treat as optimal for any action
    if (optimal === 'Split') {
      evFeedback.value = 'optimal'
      evExplanation.value = ''
      return
    }

    if (action === optimal) {
      evFeedback.value = 'optimal'
      evExplanation.value = ''
    } else {
      evFeedback.value = 'suboptimal'
      const total = playerHand.value.total
      if (optimal === 'Stand' && action === 'Hit' && total >= 17) {
        evExplanation.value = 'ev.explanation_stand_high'
      } else if (optimal === 'Hit' && action === 'Stand' && total <= 11) {
        evExplanation.value = 'ev.explanation_hit_low'
      } else if (optimal === 'Double') {
        evExplanation.value = 'ev.explanation_double_opportunity'
      } else if (optimal === 'Hit' && action === 'Stand') {
        evExplanation.value = 'ev.explanation_hit_recommended'
      } else if (optimal === 'Stand' && action === 'Hit') {
        evExplanation.value = 'ev.explanation_stand_recommended'
      } else {
        evExplanation.value = 'ev.explanation_generic'
      }
    }
  }

  const actWithFeedback = (action: 'Hit'|'Stand'|'Double', execute: () => void) => {
    if (currentPhase.value !== GamePhase.PLAYER_TURN) return
    assessAction(action)
    setPhase(GamePhase.EV_FEEDBACK)
    if (feedbackTimeoutId) clearTimeout(feedbackTimeoutId)
    
    // Auto-clear optimal feedback after animation completes
    if (evFeedback.value === 'optimal') {
      feedbackTimeoutId = setTimeout(() => {
        clearFeedback()
      }, 1500)
    }

    // Execute game logic after a short delay, to show the tooltip visually first
    setTimeout(() => {
      execute()
    }, 600)
  }

  const hit = () => {
    actWithFeedback('Hit', () => {
      playerHandCards.value.push(deckParams.drawCard(true))

      if (playerHand.value.isBust) {
        resolveHand()
      } else {
        setPhase(GamePhase.PLAYER_TURN)
      }
    })
  }

  const stand = () => {
    actWithFeedback('Stand', () => {
      executeDealerTurn()
    })
  }

  const double = () => {
    if (currentPhase.value !== GamePhase.PLAYER_TURN || playerHandCards.value.length !== 2) return

    actWithFeedback('Double', () => {
      currentBet.value *= 2
      playerHandCards.value.push(deckParams.drawCard(true))

      if (playerHand.value.isBust) {
        resolveHand()
      } else {
        executeDealerTurn()
      }
    })
  }

  return {
    currentPhase,
    playerHandCards,
    dealerHandCards,
    currentBet,
    result,
    evFeedbackAction,
    evFeedback,
    evExplanation,
    playerHand,
    dealerHand,
    setPhase,
    setBet,
    resetHand,
    resetStore,
    clearFeedback,
    deal,
    hit,
    stand,
    double
  }
})

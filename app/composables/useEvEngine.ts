import type { Card, Hand } from '../types/game'

export type PlayerAction = 'Hit' | 'Stand' | 'Double' | 'Split'

export interface EvResult {
  Hit: number
  Stand: number
  Double?: number
  Split?: number
}

// Module-level caches for DP memoization. These store pure mathematical constants
// (dealer probability distributions, optimal EVs) that are deterministic and identical
// for all users. Safe to share across Nuxt SSR requests — no user-specific state.
const dMemo: Record<string, Record<string, number>> = {}
const evMemo: Record<string, number> = {}

// Recursive Dynamic Programming for Dealer Probabilities
const getDealerProbs = (total: number, isSoft: boolean): Record<string, number> => {
  const key = `${total}-${isSoft}`
  if (dMemo[key]) return dMemo[key]
  
  if (total >= 17 && total <= 21) {
    if (total === 17 && isSoft) {
      // Standard: Dealer stands on soft 17 (S17 rule)
      const result = { 17: 1 }
      dMemo[key] = result
      return result
    }
    const result = { [total]: 1 }
    dMemo[key] = result
    return result
  }
  if (total > 21) {
    if (isSoft) {
      const result = getDealerProbs(total - 10, false)
      dMemo[key] = result
      return result
    }
    const result = { 'Bust': 1 }
    dMemo[key] = result
    return result
  }
  
  const probs: Record<string, number> = { 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 'Bust': 0 }
  for (let card = 2; card <= 11; card++) {
    const prob = card === 10 ? 4/13 : 1/13
    let t = total + card
    let softCount = (isSoft ? 1 : 0) + (card === 11 ? 1 : 0)
    while (t > 21 && softCount > 0) {
      t -= 10
      softCount--
    }
    let s = softCount > 0
    
    const sub = getDealerProbs(t, s)
    for (const [outcome, p] of Object.entries(sub)) {
      probs[outcome] += prob * p
    }
  }
  
  dMemo[key] = probs
  return probs
}

// Stand Expected Value calculations
const getStandEV = (playerTotal: number, dealerCard: number): number => {
  if (playerTotal > 21) return -1
  const dProbs = getDealerProbs(dealerCard, dealerCard === 11)
  let ev = 0
  for (const [outcome, prob] of Object.entries(dProbs)) {
    if (outcome === 'Bust') ev += prob
    else {
      const d = parseInt(outcome)
      if (playerTotal > d) ev += prob
      else if (playerTotal < d) ev -= prob
    }
  }
  return ev
}

// Optimal Play Expected Value for downstream choices
const getOptimalEV = (playerTotal: number, isSoft: boolean, dealerCard: number, canDouble: boolean = false): number => {
  if (playerTotal > 21) {
    if (isSoft) return getOptimalEV(playerTotal - 10, false, dealerCard, canDouble)
    return -1
  }
  
  const key = `${playerTotal}-${isSoft}-${dealerCard}`
  if (!canDouble && typeof evMemo[key] !== 'undefined') return evMemo[key]
  
  const standEV = getStandEV(playerTotal, dealerCard)
  let hitEV = 0
  let doubleEV = 0
  
  for (let card = 2; card <= 11; card++) {
    const prob = card === 10 ? 4/13 : 1/13
    let t = playerTotal + card
    let softCount = (isSoft ? 1 : 0) + (card === 11 ? 1 : 0)
    while (t > 21 && softCount > 0) {
      t -= 10
      softCount--
    }
    let s = softCount > 0
    
    if (t > 21) hitEV += prob * -1
    else hitEV += prob * getOptimalEV(t, s, dealerCard, false)
    
    if (canDouble) {
      if (t > 21) doubleEV += prob * -1
      else doubleEV += prob * getStandEV(t, dealerCard)
    }
  }
  
  if (canDouble) doubleEV *= 2
  
  const best = canDouble ? Math.max(standEV, hitEV, doubleEV) : Math.max(standEV, hitEV)
  if (!canDouble) evMemo[key] = best
  return best
}

export const useEvEngine = () => {
  const computeEV = (playerHand: Hand, dealerCard: Card): EvResult => {
    let d = dealerCard.value
    if (d > 11) d = 10 
    
    const p = playerHand.total
    const isSoft = playerHand.isSoft
    const canDouble = playerHand.cards.length === 2
    const isPair = canDouble && playerHand.cards[0].rank === playerHand.cards[1].rank
    
    // Natural blackjack: 3:2 payout, only pushes against dealer blackjack
    if (canDouble && p === 21) {
      let dealerBjProb = 0
      if (d === 11) dealerBjProb = 4 / 13 // Ace showing, needs 10-value
      else if (d === 10) dealerBjProb = 1 / 13 // 10-value showing, needs Ace
      const bjEV = parseFloat(((1 - dealerBjProb) * 1.5).toFixed(4))
      return { Hit: -1, Stand: bjEV }
    }
    
    const evs: EvResult = { Hit: 0, Stand: 0 }
    
    evs.Stand = parseFloat(getStandEV(p, d).toFixed(4))
    
    let hitEV = 0
    let doubleEV = 0
    
    for (let card = 2; card <= 11; card++) {
      const prob = card === 10 ? 4/13 : 1/13
      let t = p + card
      let softCount = (isSoft ? 1 : 0) + (card === 11 ? 1 : 0)
      while (t > 21 && softCount > 0) {
        t -= 10
        softCount--
      }
      let s = softCount > 0
      
      if (t > 21) hitEV += prob * -1
      else hitEV += prob * getOptimalEV(t, s, d, false)
      
      if (canDouble) {
        if (t > 21) doubleEV += prob * -1
        else doubleEV += prob * getStandEV(t, d)
      }
    }
    
    evs.Hit = parseFloat(hitEV.toFixed(4))
    
    if (canDouble) {
      evs.Double = parseFloat((doubleEV * 2).toFixed(4))
    }
    
    if (isPair) {
      let v = playerHand.cards[0].value
      if (v > 11) v = 10
      let splitHandEV = 0
      for (let card = 2; card <= 11; card++) {
        const prob = card === 10 ? 4/13 : 1/13
        let t = v + card
        let softCount = (v === 11 ? 1 : 0) + (card === 11 ? 1 : 0)
        while (t > 21 && softCount > 0) {
          t -= 10
          softCount--
        }
        let s = softCount > 0
        splitHandEV += prob * getOptimalEV(t, s, d, true) 
      }
      evs.Split = parseFloat((splitHandEV * 2).toFixed(4))
    }
    
    return evs
  }

  const getOptimalAction = (playerHand: Hand, dealerCard: Card): PlayerAction => {
    const evs = computeEV(playerHand, dealerCard)
    let bestAction: PlayerAction = 'Stand'
    let maxEv = -Infinity
    
    for (const [action, ev] of Object.entries(evs)) {
      if (ev !== undefined && ev > maxEv) {
        maxEv = ev
        bestAction = action as PlayerAction
      }
    }
    
    return bestAction
  }

  return {
    computeEV,
    getOptimalAction
  }
}

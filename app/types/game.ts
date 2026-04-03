export enum GamePhase {
  IDLE = 'IDLE',
  BETTING = 'BETTING',
  DEALING = 'DEALING',
  PLAYER_TURN = 'PLAYER_TURN',
  EV_FEEDBACK = 'EV_FEEDBACK',
  DEALER_TURN = 'DEALER_TURN',
  RESOLVING = 'RESOLVING',
  PAYOUT = 'PAYOUT'
}

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
  isFaceUp: boolean;
}

export interface Hand {
  cards: Card[];
  total: number;
  isSoft: boolean;
  isBust: boolean;
}

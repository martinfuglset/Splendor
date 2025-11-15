import type { GemColor, TokenColor } from '../types/game'

export const GEM_COLORS: GemColor[] = ['diamond', 'sapphire', 'emerald', 'ruby', 'onyx']
export const TOKEN_COLORS: TokenColor[] = [...GEM_COLORS, 'gold']

export const MAX_RESERVED_CARDS = 3
export const DEFAULT_TARGET_POINTS = 15

export const TOKEN_SUPPLY_BY_PLAYERS: Record<number, number> = {
  2: 4,
  3: 5,
  4: 7,
}

export const GOLD_SUPPLY = 5

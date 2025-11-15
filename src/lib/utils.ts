import { GEM_COLORS, TOKEN_COLORS } from './constants'
import type {
  CostMap,
  DevelopmentCard,
  GemColor,
  NobleCard,
  PlayerConfig,
  PlayerState,
  TokenBundle,
  TokenColor,
} from '../types/game'

export const createTokenBundle = (initial?: Partial<Record<TokenColor, number>>): TokenBundle => {
  const bundle = {} as TokenBundle
  TOKEN_COLORS.forEach((color) => {
    bundle[color] = initial?.[color] ?? 0
  })
  return bundle
}

export const cloneTokens = (bundle: TokenBundle): TokenBundle => createTokenBundle(bundle)

export const sumTokens = (bundle: Partial<Record<TokenColor, number>>): number =>
  Object.values(bundle).reduce((total, value = 0) => total + value, 0)

export const addTokens = (
  bundle: TokenBundle,
  delta: Partial<Record<TokenColor, number>>,
): TokenBundle => {
  const next = cloneTokens(bundle)
  TOKEN_COLORS.forEach((color) => {
    next[color] = (next[color] ?? 0) + (delta[color] ?? 0)
  })
  return next
}

export const subtractTokens = (
  bundle: TokenBundle,
  delta: Partial<Record<TokenColor, number>>,
): TokenBundle => {
  const next = cloneTokens(bundle)
  TOKEN_COLORS.forEach((color) => {
    const newValue = (next[color] ?? 0) - (delta[color] ?? 0)
    if (newValue < 0) {
      throw new Error(`Token balance for ${color} would be negative`)
    }
    next[color] = newValue
  })
  return next
}

export const hasEnoughTokens = (
  bundle: TokenBundle,
  requested: Partial<Record<TokenColor, number>>,
): boolean =>
  TOKEN_COLORS.every((color) => (bundle[color] ?? 0) >= (requested[color] ?? 0))

export const shuffle = <T>(source: T[]): T[] => {
  const array = [...source]
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const createPlayerState = (config: PlayerConfig): PlayerState => ({
  id: config.id,
  name: config.name,
  tokens: createTokenBundle(),
  bonuses: Object.fromEntries(GEM_COLORS.map((color) => [color, 0])) as Record<GemColor, number>,
  cards: [],
  reserved: [],
  nobles: [],
  points: 0,
})

export const getPaymentForCard = (
  player: PlayerState,
  card: DevelopmentCard,
): TokenBundle | null => {
  const payment = createTokenBundle()
  let goldNeeded = 0

  GEM_COLORS.forEach((color) => {
    const cost = card.cost[color] ?? 0
    const discount = player.bonuses[color] ?? 0
    const remaining = Math.max(0, cost - discount)
    const available = player.tokens[color] ?? 0
    const useFromColor = Math.min(remaining, available)
    payment[color] = useFromColor
    goldNeeded += remaining - useFromColor
  })

  if (goldNeeded > (player.tokens.gold ?? 0)) {
    return null
  }

  payment.gold = goldNeeded
  return payment
}

export const meetsNobleRequirement = (player: PlayerState, noble: NobleCard): boolean =>
  GEM_COLORS.every(
    (color) => (player.bonuses[color] ?? 0) >= (noble.cost[color] ?? 0),
  )

export const applyPayment = (player: PlayerState, payment: TokenBundle): void => {
  TOKEN_COLORS.forEach((color) => {
    player.tokens[color] -= payment[color]
  })
}

export const awardCardToPlayer = (player: PlayerState, card: DevelopmentCard): void => {
  player.cards.push(card)
  player.bonuses[card.gem] += 1
  player.points += card.points
}

export const addNobleToPlayer = (player: PlayerState, noble: NobleCard): void => {
  player.nobles.push(noble)
  player.points += noble.points
}

export const costToArray = (cost: CostMap): Array<{ color: GemColor; amount: number }> =>
  GEM_COLORS.filter((color) => (cost[color] ?? 0) > 0).map((color) => ({
    color,
    amount: cost[color] ?? 0,
  }))

export const tokensToArray = (
  tokens: Partial<Record<TokenColor, number>>,
): Array<{ color: TokenColor; amount: number }> =>
  TOKEN_COLORS.filter((color) => (tokens[color] ?? 0) > 0).map((color) => ({
    color,
    amount: tokens[color] ?? 0,
  }))

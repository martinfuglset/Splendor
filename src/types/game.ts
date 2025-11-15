export type GemColor = 'diamond' | 'sapphire' | 'emerald' | 'ruby' | 'onyx'
export type TokenColor = GemColor | 'gold'
export type CardTier = 1 | 2 | 3

export type CostMap = Partial<Record<GemColor, number>>
export type TokenBundle = Record<TokenColor, number>

export interface DevelopmentCard {
  id: string
  tier: CardTier
  gem: GemColor
  points: number
  cost: CostMap
}

export interface NobleCard {
  id: string
  cost: CostMap
  points: number
}

export interface PlayerConfig {
  id: string
  name: string
}

export interface PlayerState {
  id: string
  name: string
  tokens: TokenBundle
  bonuses: Record<GemColor, number>
  cards: DevelopmentCard[]
  reserved: DevelopmentCard[]
  nobles: NobleCard[]
  points: number
}

export interface BankState extends TokenBundle {}

export interface ActionLogEntry {
  id: string
  playerId?: string
  message: string
  timestamp: number
}

export interface GameState {
  status: 'setup' | 'playing' | 'finished'
  players: PlayerState[]
  bank: BankState
  board: Record<CardTier, (DevelopmentCard | null)[]>
  decks: Record<CardTier, DevelopmentCard[]>
  nobles: NobleCard[]
  currentPlayerIndex: number
  turn: number
  logs: ActionLogEntry[]
  targetPoints: number
  winnerIds: string[]
  finalRoundTrigger?: string
}

export interface SetupPayload {
  players: PlayerConfig[]
  targetPoints?: number
}

export type TokenSelection = Partial<Record<TokenColor, number>>

export interface TakeTokensPayload {
  playerId: string
  take: Partial<Record<GemColor, number>>
  returns?: TokenSelection
}

export type ReserveSource =
  | { kind: 'board'; tier: CardTier; cardId: string }
  | { kind: 'deck'; tier: CardTier }

export interface ReserveCardPayload {
  playerId: string
  source: ReserveSource
  returns?: TokenSelection
}

export interface PurchaseCardPayload {
  playerId: string
  source:
    | { kind: 'board'; tier: CardTier; cardId: string }
    | { kind: 'reserved'; cardId: string }
}

export type GameAction =
  | { type: 'SETUP_GAME'; payload: SetupPayload }
  | { type: 'TAKE_TOKENS'; payload: TakeTokensPayload }
  | { type: 'RESERVE_CARD'; payload: ReserveCardPayload }
  | { type: 'PURCHASE_CARD'; payload: PurchaseCardPayload }
  | { type: 'RESET_GAME' }

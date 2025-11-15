import { produce } from 'immer'
import { tier1Cards, tier2Cards, tier3Cards, nobleCards } from '../data/cards'
import type {
  CardTier,
  DevelopmentCard,
  GameAction,
  GameState,
  PlayerState,
  TokenBundle,
} from '../types/game'
import {
  DEFAULT_TARGET_POINTS,
  GEM_COLORS,
  GOLD_SUPPLY,
  MAX_RESERVED_CARDS,
  TOKEN_SUPPLY_BY_PLAYERS,
} from '../lib/constants'
import {
  addNobleToPlayer,
  addTokens,
  applyPayment,
  awardCardToPlayer,
  createPlayerState,
  createTokenBundle,
  getPaymentForCard,
  meetsNobleRequirement,
  shuffle,
  subtractTokens,
  sumTokens,
} from '../lib/utils'

const BOARD_SLOTS_PER_TIER = 4

const emptyBoard = (): Record<CardTier, Array<DevelopmentCard | null>> => ({
  1: Array(BOARD_SLOTS_PER_TIER).fill(null),
  2: Array(BOARD_SLOTS_PER_TIER).fill(null),
  3: Array(BOARD_SLOTS_PER_TIER).fill(null),
})

export const initialGameState: GameState = {
  status: 'setup',
  players: [],
  bank: createTokenBundle(),
  board: emptyBoard(),
  decks: {
    1: [],
    2: [],
    3: [],
  },
  nobles: [],
  currentPlayerIndex: 0,
  turn: 0,
  logs: [],
  targetPoints: DEFAULT_TARGET_POINTS,
  winnerIds: [],
  finalRoundTrigger: undefined,
}

const createDecks = () => ({
  1: shuffle(tier1Cards),
  2: shuffle(tier2Cards),
  3: shuffle(tier3Cards),
})

const drawCard = (deck: DevelopmentCard[]): DevelopmentCard | null => deck.shift() ?? null

const refillSlot = (
  board: Record<CardTier, Array<DevelopmentCard | null>>,
  decks: Record<CardTier, DevelopmentCard[]>,
  tier: CardTier,
  slot: number,
) => {
  board[tier][slot] = drawCard(decks[tier])
}

const drawInitialBoard = (
  decks: Record<CardTier, DevelopmentCard[]>,
): Record<CardTier, Array<DevelopmentCard | null>> => {
  const board = emptyBoard()
  ;([1, 2, 3] as CardTier[]).forEach((tier) => {
    for (let i = 0; i < BOARD_SLOTS_PER_TIER; i += 1) {
      board[tier][i] = drawCard(decks[tier])
    }
  })
  return board
}

const initialBankForPlayers = (count: number) => {
  const supply = TOKEN_SUPPLY_BY_PLAYERS[count] ?? TOKEN_SUPPLY_BY_PLAYERS[4]
  const bank = createTokenBundle()
  GEM_COLORS.forEach((color) => {
    bank[color] = supply
  })
  bank.gold = GOLD_SUPPLY
  return bank
}

const currentPlayer = (state: GameState): PlayerState | undefined =>
  state.players[state.currentPlayerIndex]

const advanceTurn = (draft: GameState) => {
  if (draft.status !== 'playing' || draft.players.length === 0) {
    return
  }
  const nextIndex = (draft.currentPlayerIndex + 1) % draft.players.length
  if (draft.finalRoundTrigger) {
    const triggerIndex = draft.players.findIndex((p) => p.id === draft.finalRoundTrigger)
    if (triggerIndex === -1) {
      draft.finalRoundTrigger = undefined
    } else if (nextIndex === triggerIndex) {
      finalizeGame(draft)
      return
    }
  }
  draft.currentPlayerIndex = nextIndex
  draft.turn += 1
}

const finalizeGame = (draft: GameState) => {
  draft.status = 'finished'
  const topScore = Math.max(...draft.players.map((p) => p.points))
  const leaders = draft.players.filter((p) => p.points === topScore)
  if (leaders.length === 1) {
    draft.winnerIds = [leaders[0].id]
  } else {
    const minCards = Math.min(...leaders.map((p) => p.cards.length))
    draft.winnerIds = leaders
      .filter((p) => p.cards.length === minCards)
      .map((player) => player.id)
  }
}

const logEvent = (draft: GameState, player: PlayerState, message: string) => {
  const entryId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`
  draft.logs.unshift({
    id: entryId,
    playerId: player.id,
    message,
    timestamp: Date.now(),
  })
  draft.logs = draft.logs.slice(0, 25)
}

const ensureTokenLimit = (tokens: TokenBundle) => {
  const total = sumTokens(tokens)
  if (total > 10) {
    throw new Error('Token limit exceeded')
  }
}

export const gameReducer = (
  state: GameState = initialGameState,
  action: GameAction,
): GameState =>
  produce(state, (draft) => {
    switch (action.type) {
      case 'SETUP_GAME': {
        const { players, targetPoints } = action.payload
        if (players.length < 2 || players.length > 4) {
          return
        }
        draft.players = players.map((config) => createPlayerState(config))
        draft.decks = createDecks()
        draft.board = drawInitialBoard(draft.decks)
        draft.nobles = shuffle(nobleCards).slice(0, players.length + 1)
        draft.bank = initialBankForPlayers(players.length)
        draft.status = 'playing'
        draft.currentPlayerIndex = 0
        draft.turn = 0
        draft.logs = []
        draft.winnerIds = []
        draft.finalRoundTrigger = undefined
        draft.targetPoints = targetPoints ?? DEFAULT_TARGET_POINTS
        return
      }
      case 'TAKE_TOKENS': {
        if (draft.status !== 'playing') {
          return
        }
        const player = currentPlayer(draft)
        if (!player || player.id !== action.payload.playerId) {
          return
        }
        try {
          const takeMap = action.payload.take
          const returnMap = action.payload.returns
          const bankAfterTake = subtractTokens(draft.bank, takeMap)
          const tokensAfterTake = addTokens(player.tokens, takeMap)
          const tokensAfterReturn = returnMap
            ? subtractTokens(tokensAfterTake, returnMap)
            : tokensAfterTake
          const bankAfterReturn = returnMap ? addTokens(bankAfterTake, returnMap) : bankAfterTake
          ensureTokenLimit(tokensAfterReturn)
          draft.bank = bankAfterReturn
          player.tokens = tokensAfterReturn
          logEvent(draft, player, 'took gem tokens')
          advanceTurn(draft)
        } catch (error) {
          console.warn(error)
        }
        return
      }
      case 'RESERVE_CARD': {
        if (draft.status !== 'playing') {
          return
        }
        const player = currentPlayer(draft)
        if (!player || player.id !== action.payload.playerId) {
          return
        }
        if (player.reserved.length >= MAX_RESERVED_CARDS) {
          return
        }
        const goldGain = draft.bank.gold > 0 ? 1 : 0
        const returns = action.payload.returns
        let workingTokens: TokenBundle = player.tokens
        if (goldGain) {
          workingTokens = addTokens(workingTokens, { gold: goldGain })
        }
        try {
          workingTokens = returns ? subtractTokens(workingTokens, returns) : workingTokens
          ensureTokenLimit(workingTokens)
        } catch (error) {
          console.warn(error)
          return
        }
        const { source } = action.payload
        let card: DevelopmentCard | null = null
        if (source.kind === 'board') {
          const slot = draft.board[source.tier].findIndex(
            (stackCard: DevelopmentCard | null) => stackCard?.id === source.cardId,
          )
          if (slot === -1) {
            return
          }
          card = draft.board[source.tier][slot]
          refillSlot(draft.board, draft.decks, source.tier, slot)
        } else if (source.kind === 'deck') {
          card = drawCard(draft.decks[source.tier])
        }
        if (!card) {
          return
        }
        player.reserved.push(card)
        player.tokens = workingTokens
        let nextBank = draft.bank
        if (goldGain) {
          nextBank = subtractTokens(nextBank, { gold: goldGain })
        }
        if (returns) {
          nextBank = addTokens(nextBank, returns)
        }
        draft.bank = nextBank
        logEvent(draft, player, 'reserved a card')
        advanceTurn(draft)
        return
      }
      case 'PURCHASE_CARD': {
        if (draft.status !== 'playing') {
          return
        }
        const player = currentPlayer(draft)
        if (!player || player.id !== action.payload.playerId) {
          return
        }
        const { source } = action.payload
        let card: DevelopmentCard | null = null
        let boardSlot: number | undefined
        if (source.kind === 'board') {
          boardSlot = draft.board[source.tier].findIndex(
            (stackCard: DevelopmentCard | null) => stackCard?.id === source.cardId,
          )
          if (boardSlot === -1) {
            return
          }
          card = draft.board[source.tier][boardSlot]
        } else {
          const index = player.reserved.findIndex((reservedCard) => reservedCard.id === source.cardId)
          if (index === -1) {
            return
          }
          card = player.reserved[index]
        }
        if (!card) {
          return
        }
        const payment = getPaymentForCard(player, card)
        if (!payment) {
          return
        }
        if (source.kind === 'board' && typeof boardSlot === 'number') {
          draft.board[source.tier][boardSlot] = drawCard(draft.decks[source.tier])
        } else if (source.kind === 'reserved') {
          player.reserved = player.reserved.filter((reservedCard) => reservedCard.id !== card.id)
        }
        applyPayment(player, payment)
        draft.bank = addTokens(draft.bank, payment)
        awardCardToPlayer(player, card)
        if (!draft.finalRoundTrigger && player.points >= draft.targetPoints) {
          draft.finalRoundTrigger = player.id
        }
        const noble = draft.nobles.find((entry) => meetsNobleRequirement(player, entry))
        if (noble) {
          addNobleToPlayer(player, noble)
          draft.nobles = draft.nobles.filter((entry) => entry.id !== noble.id)
        }
        logEvent(draft, player, 'purchased a development card')
        advanceTurn(draft)
        return
      }
      case 'RESET_GAME': {
        return initialGameState
      }
      default:
        return state
    }
  })

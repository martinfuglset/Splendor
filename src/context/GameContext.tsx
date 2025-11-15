import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { gameReducer, initialGameState } from '../state/gameReducer'
import type {
  GameAction,
  GameState,
  PurchaseCardPayload,
  ReserveCardPayload,
  SetupPayload,
  TakeTokensPayload,
} from '../types/game'
import { GEM_COLORS, MAX_RESERVED_CARDS } from '../lib/constants'
import { addTokens, getPaymentForCard, subtractTokens, sumTokens } from '../lib/utils'

interface ActionResult {
  ok: boolean
  error?: string
}

interface GameContextValue {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  actions: {
    setupGame: (payload: SetupPayload) => ActionResult
    takeTokens: (payload: TakeTokensPayload) => ActionResult
    reserveCard: (payload: ReserveCardPayload) => ActionResult
    purchaseCard: (payload: PurchaseCardPayload) => ActionResult
    resetGame: () => void
  }
}

const GameContext = createContext<GameContextValue | undefined>(undefined)

const buildError = (error: string): ActionResult => ({ ok: false, error })
const success: ActionResult = { ok: true }

const validateTakeTokens = (state: GameState, payload: TakeTokensPayload): ActionResult => {
  if (state.status !== 'playing') {
    return buildError('The game has not started yet.')
  }
  const player = state.players[state.currentPlayerIndex]
  if (!player || player.id !== payload.playerId) {
    return buildError("It isn't your turn.")
  }
  const totalRequested = GEM_COLORS.reduce((sum, color) => sum + (payload.take[color] ?? 0), 0)
  if (totalRequested === 0) {
    return buildError('Select at least one token.')
  }
  if (GEM_COLORS.some((color) => (payload.take[color] ?? 0) < 0)) {
    return buildError('Negative tokens are not allowed.')
  }
  const hasDouble = GEM_COLORS.find((color) => (payload.take[color] ?? 0) === 2)
  if (hasDouble) {
    if (totalRequested !== 2) {
      return buildError('Taking two of the same color uses your entire action.')
    }
    if ((state.bank[hasDouble] ?? 0) < 4) {
      return buildError('Need at least four tokens in the bank to take a double.')
    }
  } else {
    if (totalRequested > 3) {
      return buildError('You may take up to three different colors per turn.')
    }
    const duplicates = GEM_COLORS.some((color) => (payload.take[color] ?? 0) > 1)
    if (duplicates) {
      return buildError('All selected colors must be different.')
    }
  }
  const exceedsBank = GEM_COLORS.some(
    (color) => (payload.take[color] ?? 0) > (state.bank[color] ?? 0),
  )
  if (exceedsBank) {
    return buildError('Not enough tokens remain in the bank.')
  }
  try {
    const afterTake = addTokens(player.tokens, payload.take)
    const afterReturn = payload.returns ? subtractTokens(afterTake, payload.returns) : afterTake
    if (sumTokens(afterReturn) > 10) {
      return buildError('Players cannot hold more than 10 tokens.')
    }
  } catch (error) {
    return buildError('Token selection is invalid.')
  }
  return success
}

const validateReserve = (state: GameState, payload: ReserveCardPayload): ActionResult => {
  if (state.status !== 'playing') {
    return buildError('The game has not started yet.')
  }
  const player = state.players[state.currentPlayerIndex]
  if (!player || player.id !== payload.playerId) {
    return buildError("It isn't your turn.")
  }
  if (player.reserved.length >= MAX_RESERVED_CARDS) {
    return buildError('You already have three reserved cards.')
  }
  const source = payload.source
  if (source.kind === 'board') {
    const exists = state.board[source.tier].some((card) => card?.id === source.cardId)
    if (!exists) {
      return buildError('That card is no longer available.')
    }
  } else {
    if (state.decks[source.tier].length === 0) {
      return buildError('That deck is empty.')
    }
  }
  const goldGain = state.bank.gold > 0 ? 1 : 0
  try {
    const afterGold = goldGain ? addTokens(player.tokens, { gold: goldGain }) : player.tokens
    const afterReturn = payload.returns ? subtractTokens(afterGold, payload.returns) : afterGold
    if (sumTokens(afterReturn) > 10) {
      return buildError('Return tokens until you have 10 or fewer.')
    }
  } catch (error) {
    return buildError('Returned tokens are invalid.')
  }
  return success
}

const validatePurchase = (state: GameState, payload: PurchaseCardPayload): ActionResult => {
  if (state.status !== 'playing') {
    return buildError('The game has not started yet.')
  }
  const player = state.players[state.currentPlayerIndex]
  if (!player || player.id !== payload.playerId) {
    return buildError("It isn't your turn.")
  }
  let card = null
  if (payload.source.kind === 'board') {
    card = state.board[payload.source.tier].find((entry) => entry?.id === payload.source.cardId) ?? null
  } else {
    card = player.reserved.find((entry) => entry.id === payload.source.cardId) ?? null
  }
  if (!card) {
    return buildError('That card is unavailable.')
  }
  const payment = getPaymentForCard(player, card)
  if (!payment) {
    return buildError("You don't have the right tokens to buy that card.")
  }
  return success
}

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)

  const setupGame = useCallback(
    (payload: SetupPayload): ActionResult => {
      if (payload.players.length < 2 || payload.players.length > 4) {
        return buildError('Splendor supports 2-4 players.')
      }
      if (payload.players.some((player) => !player.name.trim())) {
        return buildError('Every player needs a name.')
      }
      dispatch({ type: 'SETUP_GAME', payload })
      return success
    },
    [],
  )

  const takeTokens = useCallback(
    (payload: TakeTokensPayload): ActionResult => {
      const validation = validateTakeTokens(state, payload)
      if (!validation.ok) {
        return validation
      }
      dispatch({ type: 'TAKE_TOKENS', payload })
      return success
    },
    [state],
  )

  const reserveCard = useCallback(
    (payload: ReserveCardPayload): ActionResult => {
      const validation = validateReserve(state, payload)
      if (!validation.ok) {
        return validation
      }
      dispatch({ type: 'RESERVE_CARD', payload })
      return success
    },
    [state],
  )

  const purchaseCard = useCallback(
    (payload: PurchaseCardPayload): ActionResult => {
      const validation = validatePurchase(state, payload)
      if (!validation.ok) {
        return validation
      }
      dispatch({ type: 'PURCHASE_CARD', payload })
      return success
    },
    [state],
  )

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' })
  }, [])

  const value = useMemo(
    () => ({
      state,
      dispatch,
      actions: { setupGame, takeTokens, reserveCard, purchaseCard, resetGame },
    }),
    [state, setupGame, takeTokens, reserveCard, purchaseCard, resetGame],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export const useGame = (): GameContextValue => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used inside a GameProvider')
  }
  return context
}

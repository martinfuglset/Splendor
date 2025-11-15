import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { useGame } from '../context/GameContext'
import { GEM_COLORS, TOKEN_COLORS } from '../lib/constants'
import type {
  CardTier,
  DevelopmentCard,
  GameState,
  GemColor,
  TokenBundle,
  TokenColor,
  TokenSelection,
} from '../types/game'
import { TokenChip } from './TokenChip'
import { DevelopmentCardView } from './DevelopmentCard'
import { NobleCardView } from './NobleCard'
import { PlayerCard } from './PlayerCard'
import { ActionSheet } from './ActionSheet'
import { TokenCounter } from './TokenCounter'
import { addTokens, costToArray, getPaymentForCard, subtractTokens, sumTokens, tokensToArray } from '../lib/utils'

const SectionTitle = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold">{title}</h3>
    <span className="h-px flex-1 bg-white/10 ml-4" />
  </div>
)

type SheetType = 'take' | 'reserve' | 'purchase' | null

export const GameScreen = () => {
  const {
    state,
    actions: { takeTokens, reserveCard, purchaseCard, resetGame },
  } = useGame()
  const currentPlayer = state.players[state.currentPlayerIndex]
  const [activeSheet, setActiveSheet] = useState<SheetType>(null)
  const [sheetError, setSheetError] = useState<string | null>(null)

  const openSheet = (type: SheetType) => {
    setSheetError(null)
    setActiveSheet(type)
  }

  const closeSheet = () => {
    setActiveSheet(null)
    setSheetError(null)
  }

  const handleTakeTokens = (payload: Partial<Record<GemColor, number>>, returns: TokenSelection) => {
    const result = takeTokens({ playerId: currentPlayer.id, take: payload, returns })
    if (!result.ok) {
      setSheetError(result.error ?? 'Unable to take tokens')
      return false
    }
    closeSheet()
    return true
  }

  const handleReserve = (
    source:
      | { kind: 'board'; tier: CardTier; cardId: string }
      | { kind: 'deck'; tier: CardTier },
    returns: TokenSelection,
  ) => {
    const result = reserveCard({ playerId: currentPlayer.id, source, returns })
    if (!result.ok) {
      setSheetError(result.error ?? 'Unable to reserve card')
      return false
    }
    closeSheet()
    return true
  }

  const handlePurchase = (
    source:
      | { kind: 'board'; tier: CardTier; cardId: string }
      | { kind: 'reserved'; cardId: string },
  ) => {
    const result = purchaseCard({ playerId: currentPlayer.id, source })
    if (!result.ok) {
      setSheetError(result.error ?? 'Unable to purchase card')
      return false
    }
    closeSheet()
    return true
  }

  const winners = state.winnerIds
    .map((id) => state.players.find((player) => player.id === id)?.name)
    .filter((name): name is string => Boolean(name))

  if (!currentPlayer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-board-bg text-slate-300">
        <p>Set up a new game to begin.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-board-bg pb-28 text-white">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-board-bg/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Round {state.turn + 1}</p>
            <h2 className="text-2xl font-bold">{currentPlayer.name}'s turn</h2>
            {state.finalRoundTrigger && (
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">Final round in progress</p>
            )}
          </div>
          <button
            type="button"
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200"
            onClick={resetGame}
          >
            New Game
          </button>
        </div>
      </header>

      {state.status === 'finished' && (
        <div className="mx-4 mt-4 rounded-3xl border border-amber-300/40 bg-amber-200/10 px-4 py-3 text-center text-amber-200">
          <p className="text-sm uppercase tracking-wide">Game Over</p>
          <p className="text-xl font-semibold">
            Winner{winners.length === 1 ? '' : 's'}: {winners.length > 0 ? winners.join(', ') : 'No winner recorded'}
          </p>
        </div>
      )}

      <main className="space-y-5 px-4 py-5">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <SectionTitle title="Bank" />
          <div className="mt-3 flex flex-wrap gap-3">
            {TOKEN_COLORS.map((color) => (
              <TokenChip key={color} color={color} value={state.bank[color]} label={color} />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <SectionTitle title="Nobles visiting" />
          <div className="mt-3 grid grid-cols-2 gap-4">
            {state.nobles.map((noble) => (
              <NobleCardView key={noble.id} noble={noble} />
            ))}
            {state.nobles.length === 0 && <p className="text-sm text-slate-400">All nobles have been claimed.</p>}
          </div>
        </section>

        {[3, 2, 1].map((tier) => (
          <section key={tier} className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Tier {tier} developments</h3>
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Deck: {state.decks[tier as CardTier].length} cards
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {state.board[tier as CardTier].map((card, index) =>
                card ? (
                  <DevelopmentCardView key={card.id} card={card} compact />
                ) : (
                  <EmptySlot key={`empty-${tier}-${index}`} />
                ),
              )}
            </div>
          </section>
        ))}

        <section className="space-y-4">
          <SectionTitle title="Players" />
          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
            {state.players.map((player) => (
              <PlayerCard key={player.id} player={player} isActive={player.id === currentPlayer.id} />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <SectionTitle title="Recent turns" />
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {state.logs.slice(0, 4).map((entry) => (
              <li key={entry.id}>
                <span className="font-semibold text-white">
                  {state.players.find((player) => player.id === entry.playerId)?.name ?? 'Player'}:
                </span>{' '}
                {entry.message}
              </li>
            ))}
            {state.logs.length === 0 && <li className="text-slate-500">Turns will appear here as the game progresses.</li>}
          </ul>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-board-bg/95 px-4 py-3 backdrop-blur">
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            className="rounded-2xl bg-amber-300 py-3 font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => openSheet('take')}
            disabled={state.status !== 'playing'}
          >
            Take Tokens
          </button>
          <button
            type="button"
            className="rounded-2xl bg-white/10 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => openSheet('reserve')}
            disabled={state.status !== 'playing'}
          >
            Reserve
          </button>
          <button
            type="button"
            className="rounded-2xl bg-white/10 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => openSheet('purchase')}
            disabled={state.status !== 'playing'}
          >
            Purchase
          </button>
        </div>
      </nav>

      <TakeTokensSheet
        isOpen={activeSheet === 'take'}
        onClose={closeSheet}
        playerTokens={currentPlayer.tokens}
        bank={state.bank}
        onSubmit={handleTakeTokens}
        error={sheetError}
      />

      <ReserveSheet
        isOpen={activeSheet === 'reserve'}
        onClose={closeSheet}
        board={state.board}
        decks={state.decks}
        bank={state.bank}
        playerTokens={currentPlayer.tokens}
        onSubmit={handleReserve}
        error={sheetError}
      />

      <PurchaseSheet
        isOpen={activeSheet === 'purchase'}
        onClose={closeSheet}
        board={state.board}
        player={currentPlayer}
        onSubmit={handlePurchase}
        error={sheetError}
      />
    </div>
  )
}

const EmptySlot = () => (
  <div className="h-32 rounded-2xl border border-dashed border-white/10 bg-slate-900/30" />
)

interface TakeTokensSheetProps {
  isOpen: boolean
  onClose: () => void
  playerTokens: TokenBundle
  bank: TokenBundle
  onSubmit: (take: Partial<Record<GemColor, number>>, returns: TokenSelection) => boolean
  error: string | null
}

const TakeTokensSheet = ({ isOpen, onClose, playerTokens, bank, onSubmit, error }: TakeTokensSheetProps) => {
  const [take, setTake] = useState<Partial<Record<GemColor, number>>>({})
  const [returns, setReturns] = useState<Partial<Record<TokenColor, number>>>({})

  const reset = () => {
    setTake({})
    setReturns({})
  }

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen])

  const filteredTake: Partial<Record<GemColor, number>> = useMemo(() => {
    const result: Partial<Record<GemColor, number>> = {}
    GEM_COLORS.forEach((color) => {
      if ((take[color] ?? 0) > 0) {
        result[color] = take[color]
      }
    })
    return result
  }, [take])

  const filteredReturns: TokenSelection = useMemo(() => {
    const result: TokenSelection = {}
    TOKEN_COLORS.forEach((color) => {
      if ((returns[color] ?? 0) > 0) {
        result[color] = returns[color]
      }
    })
    return result
  }, [returns])

  const tokensAfterTake = useMemo(() => addTokens(playerTokens, filteredTake), [playerTokens, filteredTake])
  const tokensAfterReturn = useMemo(
    () =>
      Object.keys(filteredReturns).length > 0
        ? subtractTokens(tokensAfterTake, filteredReturns)
        : tokensAfterTake,
    [tokensAfterTake, filteredReturns],
  )

  const afterTakeCount = sumTokens(tokensAfterTake)
  const afterReturnCount = sumTokens(tokensAfterReturn)
  const needToReturn = Math.max(0, afterTakeCount - 10)
  const disableConfirm = Object.keys(filteredTake).length === 0 || afterReturnCount > 10

  const handleTakeChange = (color: GemColor, value: number) => {
    const available = bank[color] ?? 0
    const allowed = available >= 4 ? 2 : 1
    const capped = Math.max(0, Math.min(value, available, allowed))
    setTake((prev) => ({ ...prev, [color]: capped }))
  }

  const handleReturnChange = (color: TokenColor, value: number) => {
    const base = playerTokens[color] ?? 0
    const additional = color !== 'gold' ? take[color as GemColor] ?? 0 : 0
    const capped = Math.max(0, Math.min(value, base + additional))
    setReturns((prev) => ({ ...prev, [color]: capped }))
  }

  const submit = () => {
    const success = onSubmit(filteredTake, filteredReturns)
    if (success) {
      reset()
    }
  }

  return (
    <ActionSheet
      isOpen={isOpen}
      onClose={() => {
        reset()
        onClose()
      }}
      title="Take tokens"
      footer={
        <div className="space-y-2">
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button
            type="button"
            className="w-full rounded-2xl bg-amber-300 py-3 text-base font-semibold text-slate-900 disabled:opacity-60"
            onClick={submit}
            disabled={disableConfirm}
          >
            Confirm action
          </button>
        </div>
      }
    >
      <p className="text-sm text-slate-300">
        Take up to three different gems or two of the same color. Return tokens if you exceed the limit of ten.
      </p>
        <div className="mt-3 rounded-2xl bg-slate-900/40 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">Select tokens</p>
          {GEM_COLORS.map((color) => (
            <TokenCounter
              key={color}
              color={color}
              label={color}
              value={take[color] ?? 0}
              max={Math.min(bank[color] ?? 0, (bank[color] ?? 0) >= 4 ? 2 : 1)}
              disabled={(bank[color] ?? 0) === 0}
              onChange={(value) => handleTakeChange(color, value)}
            />
          ))}
        </div>
      <div className="mt-4 rounded-2xl bg-slate-900/40 p-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
          <span>Return tokens</span>
          <span>
            Need to return: <strong className="text-white">{needToReturn}</strong>
          </span>
        </div>
        {TOKEN_COLORS.map((color) => {
          const max =
            color === 'gold'
              ? playerTokens.gold
              : (playerTokens[color] ?? 0) + (take[color as GemColor] ?? 0)
          return (
            <TokenCounter
              key={color}
              color={color}
              label={color}
              value={returns[color] ?? 0}
              max={max}
              disabled={max === 0}
              onChange={(value) => handleReturnChange(color, value)}
            />
          )
        })}
        <p
          className={clsx('mt-2 text-[11px]', {
            'text-rose-300': afterReturnCount > 10,
            'text-slate-400': afterReturnCount <= 10,
          })}
        >
          Tokens after action: {afterReturnCount} / 10 allowed
        </p>
        {afterReturnCount > 10 && (
          <p className="mt-1 text-[11px] text-rose-200">
            Return at least {afterReturnCount - 10} token(s) to confirm this move.
          </p>
        )}
      </div>
    </ActionSheet>
  )
}

interface ReserveSheetProps {
  isOpen: boolean
  onClose: () => void
  board: GameState['board']
  decks: GameState['decks']
  bank: TokenBundle
  playerTokens: TokenBundle
  onSubmit: (
    source: { kind: 'board'; tier: CardTier; cardId: string } | { kind: 'deck'; tier: CardTier },
    returns: TokenSelection,
  ) => boolean
  error: string | null
}

const ReserveSheet = ({
  isOpen,
  onClose,
  board,
  decks,
  bank,
  playerTokens,
  onSubmit,
  error,
}: ReserveSheetProps) => {
  const [returns, setReturns] = useState<Partial<Record<TokenColor, number>>>({})
  const [selection, setSelection] = useState<
    { kind: 'board'; tier: CardTier; cardId: string } | { kind: 'deck'; tier: CardTier } | null
  >(null)

  useEffect(() => {
    if (!isOpen) {
      setSelection(null)
      setReturns({})
    }
  }, [isOpen])

  const selectCard = (choice: { kind: 'board'; tier: CardTier; cardId: string } | { kind: 'deck'; tier: CardTier }) => {
    setSelection(choice)
  }

  const filteredReturns: TokenSelection = useMemo(() => {
    const result: TokenSelection = {}
    TOKEN_COLORS.forEach((color) => {
      if ((returns[color] ?? 0) > 0) {
        result[color] = returns[color]
      }
    })
    return result
  }, [returns])

  const goldAvailable = bank.gold > 0
  const tokensAfterGold = useMemo(
    () => (goldAvailable ? addTokens(playerTokens, { gold: 1 }) : playerTokens),
    [playerTokens, goldAvailable],
  )
  const tokensAfterReturn = useMemo(
    () =>
      Object.keys(filteredReturns).length > 0
        ? subtractTokens(tokensAfterGold, filteredReturns)
        : tokensAfterGold,
    [tokensAfterGold, filteredReturns],
  )
  const tokensAfterReserveCount = sumTokens(tokensAfterReturn)

  const submit = () => {
    if (!selection) return
    const success = onSubmit(selection, filteredReturns)
    if (success) {
      setSelection(null)
      setReturns({})
    }
  }

  return (
    <ActionSheet
      isOpen={isOpen}
      onClose={() => {
        setSelection(null)
        setReturns({})
        onClose()
      }}
      title="Reserve a card"
      footer={
        <div className="space-y-2">
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button
            type="button"
            className="w-full rounded-2xl bg-amber-300 py-3 text-base font-semibold text-slate-900 disabled:opacity-60"
            onClick={submit}
            disabled={!selection || tokensAfterReserveCount > 10}
          >
            Reserve card
          </button>
        </div>
      }
    >
      <p className="text-sm text-slate-300">
        Reserving grants a gold wildcard if any are left in the bank.
      </p>
      <div className="mt-3 space-y-3">
        {[3, 2, 1].map((tier) => (
          <div key={tier} className="rounded-2xl border border-white/5 p-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
              <span>Tier {tier}</span>
              <span>Deck: {decks[tier as CardTier].length} cards</span>
            </div>
            <div className="mt-2 grid gap-2">
              {board[tier as CardTier].map((card) =>
                card ? (
                  <button
                    key={card.id}
                    type="button"
                    className={clsx(
                      'rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-left',
                      selection?.kind === 'board' && selection.cardId === card.id
                        ? 'border-amber-300 bg-amber-200/10'
                        : 'hover:border-amber-200/40',
                    )}
                    onClick={() => selectCard({ kind: 'board', tier: tier as CardTier, cardId: card.id })}
                  >
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className="capitalize">{card.gem}</span>
                      <span>{card.points} pts</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-300">
                      {costToArray(card.cost).map(({ color, amount }) => (
                        <span key={color} className="rounded-full bg-white/5 px-2 py-0.5">
                          {amount} {color}
                        </span>
                      ))}
                    </div>
                  </button>
                ) : null,
              )}
              <button
                type="button"
                className={clsx(
                  'rounded-2xl border border-dashed border-white/10 px-3 py-2 text-left text-sm text-slate-300',
                  selection?.kind === 'deck' && selection.tier === tier ? 'border-amber-300 text-amber-200' : 'hover:border-amber-200/40',
                )}
                onClick={() => selectCard({ kind: 'deck', tier: tier as CardTier })}
                disabled={decks[tier as CardTier].length === 0}
              >
                Reserve mystery card (draw top of deck)
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-slate-900/40 p-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">Return tokens</p>
        {TOKEN_COLORS.map((color) => {
          const max =
            color === 'gold'
              ? (playerTokens.gold ?? 0) + (goldAvailable ? 1 : 0)
              : playerTokens[color] ?? 0
          return (
            <TokenCounter
              key={color}
              color={color}
              label={color}
              value={returns[color] ?? 0}
              max={max}
              disabled={max === 0}
              onChange={(value) => setReturns((prev) => ({ ...prev, [color]: Math.min(value, max) }))}
            />
          )
        })}
        {goldAvailable ? (
          <p className="mt-2 text-[11px] text-amber-200">Gold wildcard will be added to your tokens.</p>
        ) : (
          <p className="mt-2 text-[11px] text-slate-400">No gold tokens remain in the bank.</p>
        )}
        <p
          className={clsx('mt-2 text-[11px]', {
            'text-rose-300': tokensAfterReserveCount > 10,
            'text-slate-400': tokensAfterReserveCount <= 10,
          })}
        >
          Tokens after action: {tokensAfterReserveCount} / 10 allowed
        </p>
        {tokensAfterReserveCount > 10 && (
          <p className="mt-1 text-[11px] text-rose-200">
            Return at least {tokensAfterReserveCount - 10} token(s) to stay within the limit.
          </p>
        )}
      </div>
    </ActionSheet>
  )
}

interface PurchaseSheetProps {
  isOpen: boolean
  onClose: () => void
  board: GameState['board']
  player: GameState['players'][number]
  onSubmit: (
    source:
      | { kind: 'board'; tier: CardTier; cardId: string }
      | { kind: 'reserved'; cardId: string },
  ) => boolean
  error: string | null
}

const PurchaseSheet = ({ isOpen, onClose, board, player, onSubmit, error }: PurchaseSheetProps) => {
  const [selection, setSelection] = useState<{ kind: 'board'; tier: CardTier; cardId: string } | { kind: 'reserved'; cardId: string } | null>(
    null,
  )

  useEffect(() => {
    if (!isOpen) {
      setSelection(null)
    }
  }, [isOpen])

  const purchasableBoard = useMemo(
    () =>
      ([1, 2, 3] as CardTier[]).flatMap((tier) =>
        board[tier]
          .filter((card): card is DevelopmentCard => Boolean(card))
          .filter((card) => Boolean(getPaymentForCard(player, card)))
          .map((card) => ({ tier, card })),
      ),
    [board, player],
  )

  const purchasableReserved = useMemo(
    () => player.reserved.filter((card) => Boolean(getPaymentForCard(player, card))),
    [player],
  )

  const submit = () => {
    if (!selection) return
    const success = onSubmit(selection)
    if (success) {
      setSelection(null)
    }
  }

  return (
    <ActionSheet
      isOpen={isOpen}
      onClose={() => {
        setSelection(null)
        onClose()
      }}
      title="Purchase a card"
      footer={
        <div className="space-y-2">
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button
            type="button"
            className="w-full rounded-2xl bg-amber-300 py-3 text-base font-semibold text-slate-900 disabled:opacity-60"
            onClick={submit}
            disabled={!selection}
          >
            Buy card
          </button>
        </div>
      }
    >
      <p className="text-sm text-slate-300">Cards you can currently afford appear below.</p>
      <div className="mt-3 space-y-3">
        {purchasableBoard.length === 0 && purchasableReserved.length === 0 && (
          <p className="text-sm text-slate-400">Earn more tokens or discounts to buy your next card.</p>
        )}
        {purchasableBoard.map(({ tier, card }) => (
          <button
            key={card.id}
            type="button"
            className={clsx(
              'w-full rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-left',
              selection?.kind === 'board' && selection.cardId === card.id
                ? 'border-amber-300 bg-amber-200/10'
                : 'hover:border-amber-200/40',
            )}
            onClick={() => setSelection({ kind: 'board', tier, cardId: card.id })}
          >
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="capitalize">Tier {tier} · {card.gem}</span>
              <span>{card.points} pts</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-300">
              {costToArray(card.cost).map(({ color, amount }) => (
                <span key={color} className="rounded-full bg-white/5 px-2 py-0.5">
                  {amount} {color}
                </span>
              ))}
            </div>
            <PaymentBreakdown card={card} player={player} />
          </button>
        ))}
        {purchasableReserved.length > 0 && (
          <div className="rounded-2xl border border-white/10 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Reserved cards</p>
            <div className="mt-2 space-y-2">
              {purchasableReserved.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className={clsx(
                    'w-full rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-left',
                    selection?.kind === 'reserved' && selection.cardId === card.id
                      ? 'border-amber-300 bg-amber-200/10'
                      : 'hover:border-amber-200/40',
                  )}
                  onClick={() => setSelection({ kind: 'reserved', cardId: card.id })}
                >
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="capitalize">{card.gem}</span>
                    <span>{card.points} pts</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-300">
                    {costToArray(card.cost).map(({ color, amount }) => (
                      <span key={color} className="rounded-full bg-white/5 px-2 py-0.5">
                        {amount} {color}
                      </span>
                    ))}
                  </div>
                  <PaymentBreakdown card={card} player={player} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ActionSheet>
  )
}

const PaymentBreakdown = ({ card, player }: { card: DevelopmentCard; player: GameState['players'][number] }) => {
  const payment = getPaymentForCard(player, card)
  if (!payment) {
    return null
  }
  return (
    <div className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">
      Paying:
      <span className="ml-2 text-white">
        {tokensToArray(payment)
          .filter(({ amount }) => amount > 0)
          .map(({ color, amount }) => `${amount} ${color}`)
          .join(', ')}
      </span>
    </div>
  )
}

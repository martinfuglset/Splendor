import clsx from 'clsx'
import type { DevelopmentCard } from '../types/game'
import { costToArray } from '../lib/utils'

interface DevelopmentCardProps {
  card: DevelopmentCard
  compact?: boolean
  highlight?: boolean
  onSelect?: () => void
  footer?: string
}

export const DevelopmentCardView = ({ card, compact, highlight, onSelect, footer }: DevelopmentCardProps) => (
  <button
    type="button"
    onClick={onSelect}
    className={clsx(
      'w-full rounded-2xl border border-white/10 bg-board-card p-3 text-left shadow-lg transition',
      highlight ? 'ring-2 ring-amber-400' : 'hover:border-amber-300/60',
    )}
  >
    <div className="flex items-start justify-between">
      <div className="grid place-items-center rounded-full bg-white/10 px-2 py-1 text-xs font-semibold uppercase text-slate-300">
        Tier {card.tier}
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-white">{card.points}</div>
        <span className="text-xs font-semibold uppercase text-slate-400">Prestige</span>
      </div>
    </div>
    <div className="mt-3 flex items-center gap-2">
      <span className="text-xs uppercase text-slate-400">Gem</span>
      <span
        className={clsx('h-6 w-6 rounded-full border border-white/20', {
          'bg-gem-diamond': card.gem === 'diamond',
          'bg-gem-sapphire': card.gem === 'sapphire',
          'bg-gem-emerald': card.gem === 'emerald',
          'bg-gem-ruby': card.gem === 'ruby',
          'bg-gem-onyx': card.gem === 'onyx',
        })}
      />
      <p className="text-sm font-semibold text-white capitalize">{card.gem}</p>
    </div>
    <div className={clsx('mt-4 grid gap-2 text-xs uppercase tracking-wide text-slate-400', compact ? 'grid-cols-2' : 'grid-cols-3')}>
      {costToArray(card.cost).map(({ color, amount }) => (
        <div key={color} className="flex items-center justify-between rounded-lg bg-white/5 px-2 py-1">
          <span className="capitalize">{color}</span>
          <span className="text-base font-bold text-white">{amount}</span>
        </div>
      ))}
    </div>
    {footer && <div className="mt-3 text-xs font-medium text-amber-300">{footer}</div>}
  </button>
)

import clsx from 'clsx'
import type { TokenColor } from '../types/game'

interface TokenChipProps {
  color: TokenColor
  value: number
  label?: string
  dense?: boolean
}

export const TokenChip = ({ color, value, label, dense }: TokenChipProps) => (
  <div
    className={clsx(
      'flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      dense ? 'text-[10px]' : 'text-xs',
    )}
  >
    <span
      className={clsx('h-3.5 w-3.5 rounded-full', {
        'bg-gem-diamond': color === 'diamond',
        'bg-gem-sapphire': color === 'sapphire',
        'bg-gem-emerald': color === 'emerald',
        'bg-gem-ruby': color === 'ruby',
        'bg-gem-onyx': color === 'onyx',
        'bg-gem-gold': color === 'gold',
      })}
    />
    <span className="text-slate-200">
      {label ?? color}
      <span className="ml-1 text-base text-white">{value}</span>
    </span>
  </div>
)

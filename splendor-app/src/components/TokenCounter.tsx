import clsx from 'clsx'
import type { TokenColor } from '../types/game'

interface TokenCounterProps {
  color: TokenColor
  label?: string
  value: number
  max?: number
  onChange: (next: number) => void
  disabled?: boolean
}

export const TokenCounter = ({
  color,
  label,
  value,
  max = 10,
  onChange,
  disabled,
}: TokenCounterProps) => {
  const decrement = () => {
    if (value === 0 || disabled) return
    onChange(value - 1)
  }

  const increment = () => {
    if (disabled) return
    const next = Math.min(max, value + 1)
    if (next !== value) {
      onChange(next)
    }
  }

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-3">
        <span
          className={clsx('h-4 w-4 rounded-full', {
            'bg-gem-diamond': color === 'diamond',
            'bg-gem-sapphire': color === 'sapphire',
            'bg-gem-emerald': color === 'emerald',
            'bg-gem-ruby': color === 'ruby',
            'bg-gem-onyx': color === 'onyx',
            'bg-gem-gold': color === 'gold',
          })}
        />
        <span className="text-sm font-medium capitalize text-slate-100">{label ?? color}</span>
      </div>
      <div className="flex items-center gap-3 text-base font-semibold">
        <button
          type="button"
          className="rounded-full bg-white/10 px-3 py-1 text-lg leading-none text-white"
          onClick={decrement}
          disabled={disabled || value === 0}
        >
          -
        </button>
        <span className="w-6 text-center text-white">{value}</span>
        <button
          type="button"
          className="rounded-full bg-white/10 px-3 py-1 text-lg leading-none text-white"
          onClick={increment}
          disabled={disabled || value >= max}
        >
          +
        </button>
      </div>
    </div>
  )
}

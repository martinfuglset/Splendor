import clsx from 'clsx'
import type { PlayerState } from '../types/game'
import { TOKEN_COLORS } from '../lib/constants'

interface PlayerCardProps {
  player: PlayerState
  isActive: boolean
}

export const PlayerCard = ({ player, isActive }: PlayerCardProps) => (
  <div
    className={clsx(
      'min-w-[240px] rounded-3xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur transition',
      isActive && 'border-amber-300 bg-amber-200/5 shadow-[0_0_30px_rgba(251,191,36,0.15)]',
    )}
  >
    <div className="flex items-center justify-between">
      <p className="text-base font-semibold">{player.name}</p>
      <span className="text-2xl font-bold text-amber-300">{player.points}</span>
    </div>
    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
      <div className="rounded-xl bg-slate-900/60 py-2">
        <p className="text-slate-400">Cards</p>
        <p className="text-lg font-semibold text-white">{player.cards.length}</p>
      </div>
      <div className="rounded-xl bg-slate-900/60 py-2">
        <p className="text-slate-400">Nobles</p>
        <p className="text-lg font-semibold text-white">{player.nobles.length}</p>
      </div>
      <div className="rounded-xl bg-slate-900/60 py-2">
        <p className="text-slate-400">Reserved</p>
        <p className="text-lg font-semibold text-white">{player.reserved.length}</p>
      </div>
    </div>
    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
      {TOKEN_COLORS.map((color) => (
        <div key={color} className="rounded-xl bg-slate-900/40 px-2 py-1">
          <p className="capitalize text-slate-400">{color}</p>
          <p className="text-lg font-bold text-white">{player.tokens[color]}</p>
        </div>
      ))}
    </div>
  </div>
)

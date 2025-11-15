import type { NobleCard } from '../types/game'
import { costToArray } from '../lib/utils'

interface NobleCardProps {
  noble: NobleCard
}

export const NobleCardView = ({ noble }: NobleCardProps) => (
  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-4 text-white shadow-lg">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Noble</p>
      <span className="text-2xl font-bold text-amber-300">{noble.points}</span>
    </div>
    <div className="mt-4 space-y-2 text-sm">
      {costToArray(noble.cost).map(({ color, amount }) => (
        <div key={color} className="flex items-center justify-between text-slate-200">
          <span className="capitalize">{color}</span>
          <span className="font-semibold">{amount}</span>
        </div>
      ))}
    </div>
  </div>
)

import { useMemo, useState } from 'react'
import { useGame } from '../context/GameContext'
const DEFAULT_NAMES = ['Aurora', 'Bram', 'Celeste', 'Dorian']

export const SetupScreen = () => {
  const {
    actions: { setupGame },
  } = useGame()
  const [playerCount, setPlayerCount] = useState(2)
  const [names, setNames] = useState(DEFAULT_NAMES.slice(0, 4))
  const [error, setError] = useState<string | null>(null)

  const playerConfigs = useMemo(
    () =>
      Array.from({ length: playerCount }, (_, index) => ({
        id: `p-${index + 1}`,
        name: names[index] ?? `Player ${index + 1}`,
      })),
    [playerCount, names],
  )

  const startGame = () => {
    const result = setupGame({ players: playerConfigs })
    if (!result.ok) {
      setError(result.error ?? 'Unable to start game')
    }
  }

  const handleNameChange = (index: number, value: string) => {
    setNames((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-md place-items-center bg-board-bg px-6 py-10 text-white">
      <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Space Cowboys</p>
        <h1 className="mt-2 text-3xl font-bold">Splendor</h1>
        <p className="mt-1 text-sm text-slate-300">Pass-and-play digital edition for mobile</p>
        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Players</p>
          <div className="mt-3 flex items-center justify-center gap-3">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setPlayerCount(count)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${playerCount === count ? 'border-amber-300 bg-amber-200/10 text-amber-200' : 'border-white/20 text-white/70'}`}
              >
                {count} Players
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-3 text-left">
          {playerConfigs.map((player, index) => (
            <label key={player.id} className="block text-sm">
              <span className="text-slate-300">Player {index + 1} name</span>
              <input
                type="text"
                value={names[index]}
                maxLength={18}
                onChange={(event) => handleNameChange(index, event.target.value)}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </label>
          ))}
        </div>
        {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
        <button
          type="button"
          className="mt-6 w-full rounded-2xl bg-amber-300 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-amber-400/40"
          onClick={startGame}
        >
          Start Game
        </button>
      </div>
    </div>
  )
}

import type { DevelopmentCard, NobleCard } from '../types/game'

// Card and noble data derived from the MIT-licensed gembalaya project:
// https://github.com/sillle14/gembalaya

export const tier1Cards: DevelopmentCard[] = [
  { id: 't1-01', tier: 1, gem: 'onyx', points: 1, cost: { sapphire: 4 } },
  { id: 't1-02', tier: 1, gem: 'onyx', points: 0, cost: { emerald: 3 } },
  { id: 't1-03', tier: 1, gem: 'onyx', points: 0, cost: { ruby: 1, emerald: 2 } },
  { id: 't1-04', tier: 1, gem: 'onyx', points: 0, cost: { onyx: 1, ruby: 3, emerald: 1 } },
  { id: 't1-05', tier: 1, gem: 'onyx', points: 0, cost: { ruby: 1, sapphire: 2, diamond: 1, emerald: 1 } },
  { id: 't1-06', tier: 1, gem: 'onyx', points: 0, cost: { ruby: 1, sapphire: 1, diamond: 1, emerald: 1 } },
  { id: 't1-07', tier: 1, gem: 'onyx', points: 0, cost: { ruby: 1, sapphire: 2, diamond: 2 } },
  { id: 't1-08', tier: 1, gem: 'onyx', points: 0, cost: { diamond: 2, emerald: 2 } },
  { id: 't1-09', tier: 1, gem: 'sapphire', points: 0, cost: { onyx: 3 } },
  { id: 't1-10', tier: 1, gem: 'sapphire', points: 0, cost: { ruby: 1, sapphire: 1, emerald: 3 } },
  { id: 't1-11', tier: 1, gem: 'sapphire', points: 0, cost: { onyx: 2, emerald: 2 } },
  { id: 't1-12', tier: 1, gem: 'sapphire', points: 1, cost: { ruby: 4 } },
  { id: 't1-13', tier: 1, gem: 'sapphire', points: 0, cost: { onyx: 2, diamond: 1 } },
  { id: 't1-14', tier: 1, gem: 'sapphire', points: 0, cost: { ruby: 2, diamond: 1, emerald: 2 } },
  { id: 't1-15', tier: 1, gem: 'sapphire', points: 0, cost: { onyx: 1, ruby: 1, diamond: 1, emerald: 1 } },
  { id: 't1-16', tier: 1, gem: 'sapphire', points: 0, cost: { onyx: 1, ruby: 2, diamond: 1, emerald: 1 } },
  { id: 't1-17', tier: 1, gem: 'emerald', points: 1, cost: { onyx: 4 } },
  { id: 't1-18', tier: 1, gem: 'emerald', points: 0, cost: { ruby: 2, sapphire: 2 } },
  { id: 't1-19', tier: 1, gem: 'emerald', points: 0, cost: { onyx: 2, ruby: 2, sapphire: 1 } },
  { id: 't1-20', tier: 1, gem: 'emerald', points: 0, cost: { ruby: 3 } },
  { id: 't1-21', tier: 1, gem: 'emerald', points: 0, cost: { sapphire: 3, diamond: 1, emerald: 1 } },
  { id: 't1-22', tier: 1, gem: 'emerald', points: 0, cost: { onyx: 2, ruby: 1, sapphire: 1, diamond: 1 } },
  { id: 't1-23', tier: 1, gem: 'emerald', points: 0, cost: { onyx: 1, ruby: 1, sapphire: 1, diamond: 1 } },
  { id: 't1-24', tier: 1, gem: 'emerald', points: 0, cost: { sapphire: 1, diamond: 2 } },
  { id: 't1-25', tier: 1, gem: 'ruby', points: 0, cost: { sapphire: 2, emerald: 1 } },
  { id: 't1-26', tier: 1, gem: 'ruby', points: 0, cost: { onyx: 1, sapphire: 1, diamond: 1, emerald: 1 } },
  { id: 't1-27', tier: 1, gem: 'ruby', points: 0, cost: { onyx: 3, ruby: 1, diamond: 1 } },
  { id: 't1-28', tier: 1, gem: 'ruby', points: 0, cost: { onyx: 1, sapphire: 1, diamond: 2, emerald: 1 } },
  { id: 't1-29', tier: 1, gem: 'ruby', points: 0, cost: { onyx: 2, diamond: 2, emerald: 1 } },
  { id: 't1-30', tier: 1, gem: 'ruby', points: 0, cost: { ruby: 2, diamond: 2 } },
  { id: 't1-31', tier: 1, gem: 'ruby', points: 1, cost: { diamond: 4 } },
  { id: 't1-32', tier: 1, gem: 'ruby', points: 0, cost: { diamond: 3 } },
  { id: 't1-33', tier: 1, gem: 'diamond', points: 0, cost: { onyx: 2, sapphire: 2 } },
  { id: 't1-34', tier: 1, gem: 'diamond', points: 0, cost: { sapphire: 3 } },
  { id: 't1-35', tier: 1, gem: 'diamond', points: 0, cost: { onyx: 1, sapphire: 2, emerald: 2 } },
  { id: 't1-36', tier: 1, gem: 'diamond', points: 0, cost: { onyx: 1, ruby: 1, sapphire: 1, emerald: 2 } },
  { id: 't1-37', tier: 1, gem: 'diamond', points: 0, cost: { onyx: 1, ruby: 1, sapphire: 1, emerald: 1 } },
  { id: 't1-38', tier: 1, gem: 'diamond', points: 1, cost: { emerald: 4 } },
  { id: 't1-39', tier: 1, gem: 'diamond', points: 0, cost: { onyx: 1, ruby: 2 } },
  { id: 't1-40', tier: 1, gem: 'diamond', points: 0, cost: { onyx: 1, sapphire: 1, diamond: 3 } }
]


export const tier2Cards: DevelopmentCard[] = [
  { id: 't2-01', tier: 2, gem: 'onyx', points: 3, cost: { onyx: 6 } },
  { id: 't2-02', tier: 2, gem: 'onyx', points: 2, cost: { onyx: 5 } },
  { id: 't2-03', tier: 2, gem: 'onyx', points: 2, cost: { ruby: 2, sapphire: 1, emerald: 4 } },
  { id: 't2-04', tier: 2, gem: 'onyx', points: 2, cost: { ruby: 3, emerald: 5 } },
  { id: 't2-05', tier: 2, gem: 'onyx', points: 1, cost: { sapphire: 2, diamond: 3, emerald: 2 } },
  { id: 't2-06', tier: 2, gem: 'onyx', points: 1, cost: { onyx: 2, diamond: 3, emerald: 3 } },
  { id: 't2-07', tier: 2, gem: 'sapphire', points: 3, cost: { sapphire: 6 } },
  { id: 't2-08', tier: 2, gem: 'sapphire', points: 2, cost: { sapphire: 5 } },
  { id: 't2-09', tier: 2, gem: 'sapphire', points: 1, cost: { ruby: 3, sapphire: 2, emerald: 2 } },
  { id: 't2-10', tier: 2, gem: 'sapphire', points: 2, cost: { onyx: 4, ruby: 1, diamond: 2 } },
  { id: 't2-11', tier: 2, gem: 'sapphire', points: 2, cost: { sapphire: 3, diamond: 5 } },
  { id: 't2-12', tier: 2, gem: 'emerald', points: 2, cost: { sapphire: 5, emerald: 3 } },
  { id: 't2-13', tier: 2, gem: 'emerald', points: 3, cost: { emerald: 6 } },
  { id: 't2-14', tier: 2, gem: 'emerald', points: 2, cost: { emerald: 5 } },
  { id: 't2-15', tier: 2, gem: 'emerald', points: 1, cost: { onyx: 2, sapphire: 3, diamond: 2 } },
  { id: 't2-16', tier: 2, gem: 'emerald', points: 1, cost: { ruby: 2, diamond: 3, emerald: 2 } },
  { id: 't2-17', tier: 2, gem: 'emerald', points: 2, cost: { onyx: 1, sapphire: 2, diamond: 4 } },
  { id: 't2-18', tier: 2, gem: 'ruby', points: 2, cost: { onyx: 5 } },
  { id: 't2-19', tier: 2, gem: 'ruby', points: 1, cost: { onyx: 3, ruby: 2, sapphire: 3 } },
  { id: 't2-20', tier: 2, gem: 'ruby', points: 3, cost: { ruby: 6 } },
  { id: 't2-21', tier: 2, gem: 'ruby', points: 2, cost: { sapphire: 4, diamond: 1, emerald: 2 } },
  { id: 't2-22', tier: 2, gem: 'ruby', points: 1, cost: { onyx: 3, ruby: 2, diamond: 2 } },
  { id: 't2-23', tier: 2, gem: 'ruby', points: 2, cost: { onyx: 5, diamond: 3 } },
  { id: 't2-24', tier: 2, gem: 'diamond', points: 1, cost: { onyx: 2, ruby: 2, emerald: 3 } },
  { id: 't2-25', tier: 2, gem: 'diamond', points: 2, cost: { onyx: 2, ruby: 4, emerald: 1 } },
  { id: 't2-26', tier: 2, gem: 'diamond', points: 2, cost: { onyx: 3, ruby: 5 } },
  { id: 't2-27', tier: 2, gem: 'diamond', points: 2, cost: { ruby: 5 } },
  { id: 't2-28', tier: 2, gem: 'diamond', points: 1, cost: { ruby: 3, sapphire: 3, diamond: 2 } },
  { id: 't2-29', tier: 2, gem: 'diamond', points: 3, cost: { diamond: 6 } }
]


export const tier3Cards: DevelopmentCard[] = [
  { id: 't3-01', tier: 3, gem: 'diamond', points: 4, cost: { onyx: 7 } },
  { id: 't3-02', tier: 3, gem: 'diamond', points: 5, cost: { onyx: 7, diamond: 3 } },
  { id: 't3-03', tier: 3, gem: 'diamond', points: 4, cost: { onyx: 6, ruby: 3, diamond: 3 } },
  { id: 't3-04', tier: 3, gem: 'diamond', points: 3, cost: { onyx: 3, ruby: 5, sapphire: 3, emerald: 3 } },
  { id: 't3-05', tier: 3, gem: 'sapphire', points: 4, cost: { diamond: 7 } },
  { id: 't3-06', tier: 3, gem: 'sapphire', points: 5, cost: { sapphire: 3, diamond: 7 } },
  { id: 't3-07', tier: 3, gem: 'sapphire', points: 4, cost: { onyx: 3, sapphire: 3, diamond: 6 } },
  { id: 't3-08', tier: 3, gem: 'sapphire', points: 3, cost: { onyx: 5, ruby: 3, diamond: 3, emerald: 3 } },
  { id: 't3-09', tier: 3, gem: 'emerald', points: 4, cost: { sapphire: 7 } },
  { id: 't3-10', tier: 3, gem: 'emerald', points: 5, cost: { sapphire: 7, emerald: 3 } },
  { id: 't3-11', tier: 3, gem: 'emerald', points: 4, cost: { sapphire: 6, diamond: 3, emerald: 3 } },
  { id: 't3-12', tier: 3, gem: 'emerald', points: 3, cost: { onyx: 3, ruby: 3, sapphire: 3, diamond: 5 } },
  { id: 't3-13', tier: 3, gem: 'ruby', points: 4, cost: { emerald: 7 } },
  { id: 't3-14', tier: 3, gem: 'ruby', points: 5, cost: { ruby: 3, emerald: 7 } },
  { id: 't3-15', tier: 3, gem: 'ruby', points: 4, cost: { ruby: 3, sapphire: 3, emerald: 6 } },
  { id: 't3-16', tier: 3, gem: 'ruby', points: 3, cost: { onyx: 3, sapphire: 5, diamond: 3, emerald: 3 } },
  { id: 't3-17', tier: 3, gem: 'onyx', points: 4, cost: { ruby: 7 } },
  { id: 't3-18', tier: 3, gem: 'onyx', points: 5, cost: { onyx: 3, ruby: 7 } },
  { id: 't3-19', tier: 3, gem: 'onyx', points: 4, cost: { onyx: 3, ruby: 6, emerald: 3 } },
  { id: 't3-20', tier: 3, gem: 'onyx', points: 3, cost: { ruby: 3, sapphire: 3, diamond: 3, emerald: 5 } }
]


export const nobleCards: NobleCard[] = [
  { id: 'n-01', points: 3, cost: { ruby: 3, sapphire: 3, emerald: 3 } },
  { id: 'n-02', points: 3, cost: { sapphire: 3, diamond: 3, emerald: 3 } },
  { id: 'n-03', points: 3, cost: { onyx: 3, ruby: 3, emerald: 3 } },
  { id: 'n-04', points: 3, cost: { onyx: 3, ruby: 3, diamond: 3 } },
  { id: 'n-05', points: 3, cost: { onyx: 3, sapphire: 3, diamond: 3 } },
  { id: 'n-06', points: 3, cost: { sapphire: 4, emerald: 4 } },
  { id: 'n-07', points: 3, cost: { onyx: 4, diamond: 4 } },
  { id: 'n-08', points: 3, cost: { ruby: 4, emerald: 4 } },
  { id: 'n-09', points: 3, cost: { onyx: 4, ruby: 4 } },
  { id: 'n-10', points: 3, cost: { sapphire: 4, diamond: 4 } }
]

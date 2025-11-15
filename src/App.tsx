import { GameProvider, useGame } from './context/GameContext'
import { SetupScreen } from './components/SetupScreen'
import { GameScreen } from './components/GameScreen'

const AppContent = () => {
  const { state } = useGame()
  if (state.status === 'setup' || state.players.length === 0) {
    return <SetupScreen />
  }
  return <GameScreen />
}

const App = () => (
  <GameProvider>
    <AppContent />
  </GameProvider>
)

export default App

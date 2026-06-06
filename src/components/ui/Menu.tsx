import { GameSummary } from "./GameSummary";
import { StartScreen } from "./StartScreen";
import { useGameStore } from '@/store/gameStore'

export default function Menu() {
  const { gameState, setGameState, resetGame } = useGameStore();

  const isGameOver = gameState.state === 'failed' || gameState.state === 'completed';

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      {isGameOver ? (
        <GameSummary
          state={gameState.state as 'completed' | 'failed'}
          objectives={gameState.objectives}
          time={gameState.timeSpent}
          onRestart={() => { resetGame(); setGameState('menu'); }}
        />
      ) : (
        <StartScreen onStart={() => setGameState('playing')} />
      )}
    </div>
  );
}
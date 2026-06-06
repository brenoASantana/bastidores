import { GameButton } from "./GameButton";
import { useGameStore } from '@/store/gameStore'

export default function PauseMenu() {
  const { setPaused, setGameState } = useGameStore();

  return (
    <div id="pause-menu-container" className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      <h1 className="mb-12 text-6xl font-mono font-bold text-white uppercase">Pausado</h1>

      <div className="flex flex-col gap-4 w-64">
        <GameButton onClick={() => setPaused(false)} variant="outline">Retornar</GameButton>
        <GameButton onClick={() => alert('Configurações')} variant="outline">Configurações</GameButton>
        <GameButton onClick={() => { setPaused(false); setGameState('playing'); }} variant="danger">Reiniciar</GameButton>
      </div>
    </div>
  );
}
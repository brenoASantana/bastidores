import { GameButton } from "./GameButton";
import { useGameStore } from '@/store/GameStore'
import { useState, useEffect } from 'react';

export default function PauseMenu() {
  const { setPaused, setGameState } = useGameStore();
  const [canResume, setCanResume] = useState(false);

  useEffect(() => {
    // Só libera o botão de "Continuar" após 1.2 segundos do pause
    const timer = setTimeout(() => setCanResume(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleResume = () => {
    if (!canResume) return; // Impede o clique duplo ou rápido demais

    document.body.requestPointerLock?.();
    setPaused(false);
  };

  return (
    <div id="pause-menu-container" className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      <h1 className="mb-12 text-6xl font-mono font-bold text-white uppercase">Pausado</h1>

      <div className="flex flex-col gap-4 w-64">

        <GameButton
          onClick={handleResume}
          variant="outline"
          disabled={!canResume}
          className={!canResume ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {canResume ? 'Retornar' : 'Aguarde...'}
        </GameButton>

        <GameButton
          onClick={() => { setPaused(false); setGameState('menu'); }}
          variant="danger"
        >
          Sair para o Menu
        </GameButton>

      </div>
    </div>
  );
}
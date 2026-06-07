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

    // Agora é seguro pedir o Pointer Lock novamente
    document.body.requestPointerLock?.();
    setPaused(false);
  };

  return (
    <div id="pause-menu-container" className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      <h1 className="mb-12 text-6xl font-mono font-bold text-white uppercase">Pausado</h1>

      <div className="flex flex-col gap-4 w-64">

        {/* 1. Botão de Retornar unificado e protegido */}
        <GameButton
          onClick={handleResume}
          variant="outline"
          disabled={!canResume}
          className={!canResume ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {canResume ? 'Retornar' : 'Aguarde...'}
        </GameButton>

        {/* 3. DICA: Se for reiniciar, o ideal é resetar o jogo e voltar pro Menu */}
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
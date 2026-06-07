'use client'

import { useEffect, useState } from 'react';
import { GameSummary } from "./GameSummary";
import { StartScreen } from "./StartScreen";
import CreditsScreen from "./CreditsScreen";
import { useGameStore } from '@/store/GameStore';
import { GameOverState } from "@/utils/Game";
import { getAudioSystem } from '@/config/AudioSystem';

export default function Menu() {
  const { gameState, setGameState, resetGame } = useGameStore();
  const [showCredits, setShowCredits] = useState(false);
  const isGameOver = gameState.state === 'failed' || gameState.state === 'completed';

  // 1. Toca música do menu ao montar
  useEffect(() => {
    const initAndPlay = async () => {
      const audio = getAudioSystem();

      // Garantimos que o sistema está carregado ANTES de tentar tocar
      await audio.initializeEssential();

      // Agora é seguro tocar, pois sabemos que as tracks estão no Map
      audio.startMenuMusic();
    };

    initAndPlay();

    return () => {
      // Para o cleanup ser seguro, podemos verificar se o sistema está pronto
      const audio = getAudioSystem();
      audio.stopMenuMusic();
    };
  }, []);

  // 2. Função de disparo (Onde a mágica do áudio acontece)
  const handleStartGame = async () => {
    const audio = getAudioSystem();

    // Agora carrega os assets pesados de gameplay
    await audio.initializeGameplay();

    audio.stopMenuMusic();
    audio.startAmbient();
    setGameState('playing');
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      {isGameOver ? (
        <GameSummary
          state={gameState.state as GameOverState}
          time={gameState.timeSpent}
          onRestart={() => { resetGame(); setGameState('menu'); }}
        />
      ) : showCredits ? (
        <CreditsScreen onBack={() => setShowCredits(false)} />
      ) : (
        <StartScreen
          // AQUI ESTAVA O SEGREDO: usar a função que criamos
          onStart={handleStartGame}
          onCredits={() => setShowCredits(true)}
        />
      )}
    </div>
  );
}
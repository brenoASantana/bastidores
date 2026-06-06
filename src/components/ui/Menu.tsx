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

  useEffect(() => {
    const audio = getAudioSystem();
    audio.startMenuMusic(); // Toca a música do menu
    return () => audio.stopMenuMusic(); // Para quando sair do menu
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      {isGameOver ? (
        <GameSummary
          state={gameState.state as GameOverState}
          time={gameState.timeSpent}
          onRestart={() => { resetGame(); setGameState('menu'); }}
        />
      ) : showCredits ? (
        // Se o botão créditos for clicado, renderiza esta tela
        <CreditsScreen onBack={() => setShowCredits(false)} />
      ) : (
        // Tela inicial padrão
        <StartScreen
          onStart={() => setGameState('playing')}
          onCredits={() => setShowCredits(true)}
        />
      )}
    </div>
  );
}
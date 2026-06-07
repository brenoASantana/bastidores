'use client'

import { getAudioSystem } from '@/config/AudioSystem';
import { ASSETS } from '@/config/Constants';
import { useGameStore } from '@/store/GameStore';
import { GameOverState } from "@/utils/Game";
import { useEffect, useState } from 'react';
import CreditsScreen from "./CreditsScreen";
import { GameSummary } from "./GameSummary";
import { StartScreen } from "./StartScreen";
import { LoadingScreen } from "./LoadingScreen"; // Garanta que este import exista

export default function Menu() {
  const { gameState, setGameState, resetGame } = useGameStore();
  const [showCredits, setShowCredits] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isGameOver = gameState.state === 'failed' || gameState.state === 'completed';

  // Controle de áudio por estado
  useEffect(() => {
    const audio = getAudioSystem();
    if (gameState.state === 'menu' || gameState.state === 'failed' || gameState.state === 'completed') {
      audio.stopAmbient();
      audio.stopSoundtrack();
      audio.stopSFX('player_footstep_walk');
      audio.stopSFX('player_footstep_run');
      audio.updateAnxietyLayer(0);
      audio.resumeAudioContext();
      audio.startMenuMusic();
    }
  }, [gameState.state]);

  // Desbloqueio inicial de áudio (1º clique no site)
  useEffect(() => {
    const audio = getAudioSystem();
    audio.initializeEssential();

    const unlockAudio = () => {
      audio.resumeAudioContext();
      audio.startMenuMusic();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  const handleStartGame = () => {
    setIsTransitioning(true);
    setTimeout(async () => {
      const audio = getAudioSystem();
      await audio.initializeGameplay();
      audio.stopMenuMusic();
      audio.startAmbient();
      audio.startSoundtrack();
      setGameState('playing');
    }, 150);
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex items-center justify-center bg-black overflow-hidden z-50">

      {/* CAMADA 0: O VÍDEO (Fica estático no fundo de tudo) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        src={ASSETS.VIDEO.MENU_BACKGROUND}
      />

      {/* CAMADA 1: ESCURECIMENTO BASE DO VÍDEO */}
      <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none" />

      {/* CAMADA 2: CONTEÚDO DA INTERFACE (Flutua por cima do vídeo) */}
      <div className="relative z-20 pointer-events-auto flex flex-col items-center justify-center w-full h-full">
        {isTransitioning ? (
          <LoadingScreen />
        ) : isGameOver ? (
          <GameSummary
            state={gameState.state as GameOverState}
            time={gameState.timeSpent}
            onRestart={() => {
              resetGame();
              setGameState('menu');
            }}
          />
        ) : showCredits ? (
          <CreditsScreen onBack={() => setShowCredits(false)} />
        ) : (
          <StartScreen
            onStart={handleStartGame}
            onCredits={() => setShowCredits(true)}
          />
        )}
      </div>

    </div>
  );
}
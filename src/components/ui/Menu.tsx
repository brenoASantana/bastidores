'use client'

import { getAudioSystem } from '@/config/AudioSystem';
import { ASSETS } from '@/config/Constants';
import { useGameStore } from '@/store/GameStore';
import { GameOverState } from "@/utils/Game";
import { useEffect, useState } from 'react';
import CreditsScreen from "./CreditsScreen";
import { GameSummary } from "./GameSummary";
import { StartScreen } from "./StartScreen";

export default function Menu() {
  const { gameState, setGameState, resetGame } = useGameStore();
  const [showCredits, setShowCredits] = useState(false);
  const isGameOver = gameState.state === 'failed' || gameState.state === 'completed';

  useEffect(() => {
    const initAndPlay = async () => {
      const audio = getAudioSystem();
      await audio.initializeEssential();
      audio.startMenuMusic();
    };
    initAndPlay();

    return () => {
      const audio = getAudioSystem();
      audio.stopMenuMusic();
    };
  }, []);

  const handleStartGame = async () => {
    const audio = getAudioSystem();
    await audio.initializeGameplay();
    audio.stopMenuMusic();
    audio.startAmbient();
    setGameState('playing');
  };

  return (
    // 1. Mudamos de 'relative' para 'fixed inset-0 z-50' para garantir que cubra a tela toda e fique acima do Canvas 3D
    <div className="fixed inset-0 w-full h-[100dvh] flex items-center justify-center bg-black overflow-hidden z-50">

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" /* <-- Adicione aqui */
        src={ASSETS.VIDEO.MENU_BACKGROUND}
      />

      {/* 2. FILTROS RETRO CRT & GLITCH */}
      <div className="absolute inset-0 z-0 pointer-events-none crt-flicker">
        {/* Escurecimento base */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Scanlines horizontais */}
        <div className="absolute inset-0 scanlines opacity-70" />

        {/* Bordas escurecidas */}
        <div className="absolute inset-0 vignette" />

        {/* 2. Forçamos um z-index gigantesco e garantimos que ele aceite cliques (pointer-events-auto) */}
        <div className="relative z-[999] pointer-events-auto flex flex-col items-center justify-center w-full h-full">
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
              onStart={handleStartGame}
              onCredits={() => setShowCredits(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
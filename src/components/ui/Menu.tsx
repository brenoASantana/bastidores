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

  // --- LÓGICA 1: OUVINTE DE ESTADO DO JOGO ---
  // Isso reage toda vez que você ganha, morre ou clica em restart
  useEffect(() => {
    const audio = getAudioSystem();

    if (gameState.state === 'menu' || gameState.state === 'failed' || gameState.state === 'completed') {
      // Corta o clima de gameplay
      audio.stopAmbient();
      audio.stopSoundtrack();
      audio.stopSFX('player_footstep_walk');
      audio.stopSFX('player_footstep_run');
      audio.updateAnxietyLayer(0);

      // Destrava o navegador e força a música do menu a tocar
      audio.resumeAudioContext();
      audio.startMenuMusic();
    }
  }, [gameState.state]);


  // --- LÓGICA 2: INICIALIZAÇÃO NO PRIMEIRO ACESSO DO USUÁRIO ---
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

  const handleStartGame = async () => {
    const audio = getAudioSystem();
    await audio.initializeGameplay();
    audio.stopMenuMusic();
    audio.startAmbient();
    audio.startSoundtrack();
    setGameState('playing');
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex items-center justify-center bg-black overflow-hidden z-50">

      {/* VÍDEO FICA AQUI (Pois ele é exclusivo do Menu) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        src={ASSETS.VIDEO.MENU_BACKGROUND}
      />

      {/* Escurecimento base do vídeo para os botões aparecerem */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

      {/* CONTEÚDO DO MENU */}
      <div className="relative z-[999] pointer-events-auto flex flex-col items-center justify-center w-full h-full">
        {isGameOver ? (
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
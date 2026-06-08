'use client'

import { getAudioSystem } from '@/config/AudioSystem';
import { ASSETS } from '@/config/Constants';
import { useGameStore } from '@/store/GameStore';
import { GameOverState } from "@/utils/Game";
import { useEffect, useState } from 'react';
import CreditsScreen from "./CreditsScreen";
import { GameSummary } from "./GameSummary";
import { StartScreen } from "./StartScreen";
import { LoadingScreen }  from "./LoadingScreen";

export default function Menu() {
  const { gameState, setGameState, resetGame } = useGameStore();
  const [showCredits, setShowCredits] = useState(false);

  // --- NOVOS ESTADOS PARA A CUTSCENE ---
  const [introStep, setIntroStep] = useState(0); // 0 = Menu normal, 1/2/3 = Textos, 4 = Glitch
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isGameOver = gameState.state === 'failed' || gameState.state === 'completed';

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

  // --- O MOTOR DA CUTSCENE ---
  const handleStartIntro = () => {
    const audio = getAudioSystem();

    // Corta a música do menu subitamente para deixar só o som do vídeo (ou silêncio)
    audio.stopMenuMusic();

    // Fase 1: Mostra o primeiro verso (0 segundos)
    setIntroStep(1);

    // Fase 2: Mostra o segundo verso (4 segundos depois)
    setTimeout(() => {
      setIntroStep(2);
    }, 4000);

    // Fase 3: Mostra o último verso (8 segundos depois)
    setTimeout(() => {
      setIntroStep(3);
    }, 8000);

    // Fase 4: O Colapso (11.5 segundos depois)
    setTimeout(() => {
      setIntroStep(4); // Ativa o clarão/glitch visual
      audio.playSFX('events.entity_scream', 0.8); // Grito para assustar
    }, 11500);

    // Fase 5: Inicia o Jogo 3D (12 segundos depois)
    setTimeout(async () => {
      setIsTransitioning(true); // Pisca a tela de loading rapidinho para o 3D não engasgar
      await audio.initializeGameplay();
      audio.startAmbient();
      audio.startSoundtrack();
      setGameState('playing');
      setIntroStep(0); // Reseta a cutscene para o futuro
      setIsTransitioning(false);
    }, 12000);
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex items-center justify-center bg-black overflow-hidden z-50">

      {/* VÍDEO DE FUNDO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-all duration-[2000ms] ${introStep > 0 ? 'scale-110 blur-sm brightness-50' : 'scale-100 blur-0 brightness-100'
          }`}
        src={ASSETS.VIDEO.MENU_BACKGROUND}
      />

      {/* TELA DE CLARÃO / GLITCH (Só aparece no introStep 4) */}
      <div className={`absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-75 ${introStep === 4 ? 'opacity-100' : 'opacity-0'
        }`} />

      {/* CAMADA DE TEXTOS POÉTICOS DA CUTSCENE */}
      {introStep > 0 && introStep < 4 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-8 pointer-events-none">
          <p className={`text-white text-2xl md:text-3xl text-center font-serif italic tracking-wider transition-opacity duration-1000 ${introStep === 1 ? 'opacity-100' : 'opacity-0 absolute'
            }`}>
            Eu sempre achei que as paredes respiravam...
          </p>

          <p className={`text-white text-2xl md:text-3xl text-center font-serif italic tracking-wider transition-opacity duration-1000 ${introStep === 2 ? 'opacity-100' : 'opacity-0 absolute'
            }`}>
            Mas hoje, a marca não era apenas uma mancha.
          </p>

          <p className={`text-red-500 font-bold text-3xl md:text-4xl text-center font-serif tracking-[0.2em] transition-opacity duration-1000 ${introStep === 3 ? 'opacity-100 scale-110' : 'opacity-0 absolute scale-95'
            }`}>
            Ela era um convite.
          </p>
        </div>
      )}

      {/* ESCURECIMENTO BASE DA UI DO MENU */}
      <div className={`absolute inset-0 bg-black/50 z-10 pointer-events-none transition-opacity duration-1000 ${introStep > 0 ? 'opacity-0' : 'opacity-100'
        }`} />

      {/* CONTEÚDO DO MENU (Escondido se a intro estiver rodando) */}
      <div className={`relative z-20 pointer-events-auto flex flex-col items-center justify-center w-full h-full transition-opacity duration-1000 ${introStep > 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
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
            // Substituímos o handleStartGame direto pela nossa Cutscene!
            onStart={handleStartIntro}
            onCredits={() => setShowCredits(true)}
          />
        )}
      </div>

    </div>
  );
}
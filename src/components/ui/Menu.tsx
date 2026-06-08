'use client'

import { getAudioSystem } from '@/config/AudioSystem';
import { ASSETS } from '@/config/Constants';
import { useGameStore } from '@/store/GameStore';
import { GameOverState } from "@/utils/Game";
import { useEffect, useState } from 'react';
import CreditsScreen from "./CreditsScreen";
import { GameSummary } from "./GameSummary";
import { StartScreen } from "./StartScreen";
import { LoadingScreen } from "./LoadingScreen";
import Image from 'next/image';
import HowToPlayScreen from "./HowToPlayScreen";

export default function Menu() {
  const { gameState, setGameState, resetGame } = useGameStore();
  const [showCredits, setShowCredits] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Estados para a Cutscene
  const [introStep, setIntroStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isGameOver = gameState.state === 'failed' || gameState.state === 'completed';

  // Gerenciamento de Áudio ao voltar pro Menu
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

  // Destravamento inicial do áudio
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

  // --- MOTOR DA CUTSCENE (VIBE KANE PIXELS + ZOOM) ---
  const handleStartIntro = () => {
    const audio = getAudioSystem();
    audio.stopMenuMusic();
    setIntroStep(1);

    setTimeout(() => {
      setIntroStep(2);
    }, 4000);

    setTimeout(() => {
      setIntroStep(3);
    }, 8000);

    // O Clímax: O Glitch (11.5 segundos)
    setTimeout(() => {
      setIntroStep(4);
      audio.playSFX('player_transition_enter', 1.0);
    }, 11500);

    // Inicia o Jogo 3D (12 segundos)
    setTimeout(async () => {
      setIsTransitioning(true);
      await audio.initializeGameplay();
      audio.startAmbient();
      audio.startSoundtrack();
      setGameState('playing');
      setIntroStep(0);
      setIsTransitioning(false);
    }, 12000);
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex items-center justify-center bg-black overflow-hidden z-50">

      {/* 1. FOTO DE FUNDO (Com Zoom Violento no Clímax simulando o Noclip) */}
      <Image
        src={ASSETS.TEXTURES.DOORWAY}
        alt="Background"
        fill
        priority
        className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-all origin-center ${introStep === 4
          ? 'duration-500 scale-[800%] blur-none brightness-150' : // Puxão para dentro da parede
          introStep > 0
            ? 'duration-[2000ms] scale-110 blur-sm brightness-50' :
            'duration-[2000ms] scale-100 blur-0 brightness-100'
          }`}
      />

      {/* 2. TELA DE CLARÃO / GLITCH VISUAL (introStep 4) */}
      <div className={`absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-75 ${introStep === 4 ? 'opacity-100 mix-blend-difference' : 'opacity-0'
        }`} />

      {/* 3. CAMADA DE TEXTOS DA CUTSCENE (Fundação Async Vibe) */}
      {introStep > 0 && introStep < 4 && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 pointer-events-none">

          <p className={`text-green-500 text-xl md:text-2xl text-center font-mono uppercase tracking-[0.2em] transition-opacity duration-1000 ${introStep === 1 ? 'opacity-100' : 'opacity-0 absolute'
            }`}>
            RELATÓRIO DO DEPARTAMENTO: PROJETO KV31
          </p>

          <p className={`text-white text-lg md:text-xl text-center font-mono uppercase tracking-[0.1em] transition-opacity duration-1000 ${introStep === 2 ? 'opacity-100' : 'opacity-0 absolute'
            }`}>
            O que consideramos ser os limites da nossa realidade... <br className="hidden md:block" /> são muito mais frágeis do que imaginávamos.
          </p>

          <p className={`text-red-600 font-bold text-3xl md:text-5xl text-center font-mono uppercase tracking-[0.3em] transition-opacity duration-1000 ${introStep === 3 ? 'opacity-100 scale-110' : 'opacity-0 absolute scale-95'
            }`}>
            AVISO: LIMIAR MAGNÉTICO ROMPIDO
          </p>

        </div>
      )}

      {/* 4. ESCURECIMENTO BASE DA UI DO MENU */}
      <div className={`absolute inset-0 bg-black/50 z-10 pointer-events-none transition-opacity duration-1000 ${introStep > 0 ? 'opacity-0' : 'opacity-100'
        }`} />

      {/* 5. CONTEÚDO DO MENU */}
      <div className={`relative z-20 pointer-events-auto flex flex-col items-center justify-center w-full h-full transition-opacity duration-1000 ${introStep > 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
        {isTransitioning ? (
          <LoadingScreen />
        ) : isGameOver ? (
          <GameSummary
            state={gameState.state as GameOverState}
            time={gameState.timeSpent}
            onRestart={() => { resetGame(); setGameState('menu'); }}
          />
        ) : showCredits ? (
          <CreditsScreen onBack={() => setShowCredits(false)} />
        ) : showHowToPlay ? (
          <HowToPlayScreen onBack={() => setShowHowToPlay(false)} />
        ) : (
          <StartScreen
            onStart={handleStartIntro}
            onCredits={() => setShowCredits(true)}
            onHowToPlay={() => setShowHowToPlay(true)}
          />
        )}
      </div>

    </div>
  );
}
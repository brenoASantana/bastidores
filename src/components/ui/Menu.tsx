'use client'

import { getAudioSystem } from '@/config/AudioSystem';
import { ASSETS } from '@/config/Constants';
import { useGameStore } from '@/store/GameStore';
import { GameOverState } from "@/utils/Game";
import { useEffect, useRef, useState } from 'react';
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

  const [introStep, setIntroStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isGameOver = gameState.state === 'failed' || gameState.state === 'completed';

  // O CADEADO: Garante que a cutscene só seja disparada uma única vez
  const isStartingRef = useRef(false);

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

      // DESTRANCA O CADEADO para permitir uma nova partida após o Game Over
      isStartingRef.current = false;
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

  // --- MOTOR DA CUTSCENE ---
  const handleStartIntro = () => {
    // 1. SE O CADEADO ESTIVER TRANCADO, IGNORA QUALQUER CLIQUE EXTRA
    if (isStartingRef.current) return;
    isStartingRef.current = true; // Tranca o cadeado no milissegundo do primeiro clique!

    const audio = getAudioSystem();
    audio.stopMenuMusic();

    setIntroStep(1);

    setTimeout(() => {
      setIntroStep(2);
    }, 4000);

    setTimeout(() => {
      setIntroStep(3);
    }, 8000);

    // O Clímax (11.5s):
    // - O áudio inicia do segundo 0.
    // - O zoom e o clarão branco disparam.
    setTimeout(() => {
      setIntroStep(4);
      audio.playSFX('player_transition_enter', 1.0);
    }, 11500);

    // O Despertar (14.5s):
    // - Exatos 3 segundos após o clímax.
    // - A interface some (Hard Cut), o jogador cai no 3D.
    // - O áudio já está no seu 3º segundo, fluindo naturalmente para a parte de "ambiente" até o 7º segundo.
    setTimeout(async () => {
      setIsTransitioning(true);
      await audio.initializeGameplay();
      audio.startAmbient();
      audio.startSoundtrack();
      setGameState('playing'); // Isso desmonta o Menu instantaneamente!
      setIntroStep(0);
      setIsTransitioning(false);
    }, 14500);
  };

  return (
    // ADICIONADO: select-none para blindar o arrasto de texto geral
    <div className="fixed inset-0 w-full h-[100dvh] flex items-center justify-center bg-black overflow-hidden z-50 select-none">

      {/* 1. FOTO DE FUNDO (Configurada para o Noclip de 3 segundos e bloqueio de arrasto) */}
      <Image
        src={ASSETS.TEXTURES.DOORWAY}
        alt="Background"
        fill
        priority
        draggable={false} // <-- ADICIONADO: Impede o jogador de "puxar" a imagem com o mouse
        className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-all origin-center ${introStep === 4
          ? 'duration-[3000ms] scale-[800%] blur-none brightness-150' :
          introStep > 0
            ? 'duration-[2000ms] scale-110 blur-sm brightness-50' :
            'duration-[2000ms] scale-100 blur-0 brightness-100'
          }`}
      />

      {/* 2. CLARÃO VISUAL (Dura exatos 3 segundos junto com o Glitch do áudio) */}
      <div className={`absolute inset-0 bg-white z-40 pointer-events-none transition-opacity ${introStep === 4 ? 'duration-[3000ms] opacity-100 mix-blend-difference' : 'duration-75 opacity-0'
        }`} />

      {/* 3. CAMADA DE TEXTOS DA CUTSCENE (Correção de Layout e Interação) */}
      {introStep > 0 && introStep < 4 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">

          <p className={`absolute w-full text-green-500 text-xl md:text-2xl text-center font-mono uppercase tracking-[0.2em] transition-opacity duration-1000 select-none ${introStep === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
            RELATÓRIO DO DEPARTAMENTO: <span className="hidden-block pointer-events-auto">PROJETO KV31</span>
          </p>

          <p className={`absolute w-full text-white text-lg md:text-xl text-center font-mono uppercase tracking-[0.1em] transition-opacity duration-1000 select-none ${introStep === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
            O que consideramos ser os limites da nossa realidade... <br />
            são muito mais <span className="hidden-block pointer-events-auto">frágeis</span> do que imaginávamos.
          </p>

          <p className={`absolute w-full text-red-600 font-bold text-3xl md:text-5xl text-center font-mono uppercase tracking-[0.3em] transition-opacity duration-1000 select-none ${introStep === 3 ? 'opacity-100 scale-110' : 'opacity-0 scale-95 pointer-events-none'
            }`}>
            AVISO: LIMIAR MAGNÉTICO ROMPIDO
          </p>

        </div>
      )}

      {/* 4. ESCURECIMENTO BASE DO MENU */}
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
'use client'

import { getAudioSystem } from '@/config/AudioSystem';
import { ASSETS } from '@/config/Constants';
import { useGameStore } from '@/store/GameStore';
import { GameOverState } from "@/utils/Game";
import { generateProceduralMap } from '@/utils/MapGenerator';
import { useEffect, useRef, useState } from 'react';
import CreditsScreen from "./CreditsScreen";
import { GameSummary } from "./GameSummary";
import { StartScreen } from "./StartScreen";
import { LoadingScreen } from "./LoadingScreen";
import Image from 'next/image';
import HowToPlayScreen from "./HowToPlayScreen";

export default function Menu() {
  const { gameState, setGameState, resetGame, setMap } = useGameStore();
  const [showCredits, setShowCredits] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false); // NOVO ESTADO: Controla o tutorial no meio do fluxo

  const [introStep, setIntroStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const isGameOver = gameState.state === 'failed' || gameState.state === 'completed';
  const isStartingRef = useRef(false);

  useEffect(() => {
    const audio = getAudioSystem();
    if (gameState.state === 'menu' || gameState.state === 'failed' || gameState.state === 'completed') {
      audio.stopAmbient();
      audio.stopSoundtrack();
      audio.stopSFX('player_footstep_walk');
      audio.updateAnxietyLayer(0);
      audio.resumeAudioContext();
      audio.startMenuMusic();

      isStartingRef.current = false;
      setIsLocked(false);
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

  // --- NOVA LÓGICA DE FLUXO ---
  const handleStartFlow = () => {
    setShowTutorial(true); // Passo 1: Abre o tutorial
  };

  const handleContinueFromTutorial = () => {
    setShowTutorial(false); // Passo 2: Fecha o tutorial e Roda a Intro
    handleStartIntro();
  };

  const handleContinueFromSummary = () => {
    resetGame();             // Passo 3: Limpa os status do jogador
    setGameState('menu');    // Passo 4: Sai do estado de GameOver
    setShowCredits(true);    // Passo 5: Abre a tela de créditos
  };
  // ----------------------------

  const handleStartIntro = () => {
    if (isStartingRef.current) return;

    isStartingRef.current = true;
    setIsLocked(true);

    const audio = getAudioSystem();
    audio.stopMenuMusic();

    setIntroStep(1);

    setTimeout(() => setIntroStep(2), 4000);
    setTimeout(() => setIntroStep(3), 8000);

    setTimeout(() => {
      setIntroStep(4);
      audio.playSFX('player_transition_enter', 1.0);
    }, 11500);

    setTimeout(async () => {
      setIsTransitioning(true);
      await audio.initializeGameplay();

      const novoMapaAleatorio = generateProceduralMap();
      setMap(novoMapaAleatorio);

      audio.startAmbient();
      audio.startSoundtrack();
      setGameState('playing');
      setIntroStep(0);
      setIsTransitioning(false);
    }, 14500);
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex items-center justify-center bg-black overflow-hidden z-50 select-none">
      <Image
        src={ASSETS.TEXTURES.DOORWAY_WIDE}
        alt="Background"
        fill
        priority
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-all origin-center ${introStep === 4
          ? 'duration-[3000ms] scale-[800%] blur-none brightness-150' :
          introStep > 0
            ? 'duration-[2000ms] scale-110 blur-sm brightness-50' :
            'duration-[2000ms] scale-100 blur-0 brightness-100'
          }`}
      />

      <div className={`absolute inset-0 bg-white z-40 pointer-events-none transition-opacity ${introStep === 4 ? 'duration-[3000ms] opacity-100 mix-blend-difference' : 'duration-75 opacity-0'}`} />

      {introStep > 0 && introStep < 4 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <p className={`absolute w-full text-green-500 text-xl md:text-2xl text-center font-mono uppercase tracking-[0.2em] transition-opacity duration-1000 select-none ${introStep === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            RELATÓRIO DO DEPARTAMENTO:<br /><span className="hidden-block pointer-events-auto">PROJETO KV31</span>
          </p>

          <p className={`absolute w-full text-white text-lg md:text-xl text-center font-mono uppercase tracking-[0.1em] transition-opacity duration-1000 select-none ${introStep === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            O que consideramos ser os limites da nossa realidade... <br />
            são muito mais <span className="hidden-block pointer-events-auto">frágeis</span> do que imaginávamos.
          </p>

          <p className={`absolute w-full text-red-600 font-bold text-3xl md:text-5xl text-center font-mono uppercase tracking-[0.3em] transition-opacity duration-1000 select-none ${introStep === 3 ? 'opacity-100 scale-110' : 'opacity-0 scale-95 pointer-events-none'}`}>
            AVISO:<br />LIMIAR MAGNÉTICO ROMPIDO
          </p>
        </div>
      )}

      <div className={`absolute inset-0 bg-black/50 z-10 pointer-events-none transition-opacity duration-1000 ${introStep > 0 ? 'opacity-0' : 'opacity-100'}`} />

      <fieldset
        disabled={isLocked}
        className={`relative z-20 pointer-events-auto flex flex-col items-center justify-center w-full h-full transition-opacity duration-1000 border-none p-0 m-0 ${introStep > 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        {isTransitioning ? (
          <LoadingScreen />
        ) : isGameOver ? (
          <GameSummary
            state={gameState.state as GameOverState}
            time={gameState.timeSpent}
            onContinue={handleContinueFromSummary} // <-- Prop de Prosseguir
          />
        ) : showCredits ? (
          <CreditsScreen onBack={() => setShowCredits(false)} />
        ) : showTutorial ? (
          <HowToPlayScreen onContinue={handleContinueFromTutorial} /> // <-- Novo fluxo do Tutorial
        ) : (
          <StartScreen
            onStart={handleStartFlow}
            onCredits={() => setShowCredits(true)}
          // onHowToPlay foi removido!
          />
        )}
      </fieldset>
    </div>
  );
}
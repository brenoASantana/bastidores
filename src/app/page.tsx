'use client'

import GameContainer from '@/components/game/GameContainer';
import Menu from '@/components/ui/Menu';
import { useGameStore } from '@/store/GameStore';
import { LoadingScreen } from '@/components/ui/LoadingScreen'

export default function Home() {
  const gameState = useGameStore((state) => state.gameState)

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">

      {/* CAMADA 3 (Topo Absoluto): Tela de Carregamento */}
      {/* O Z-index altíssimo garante que ela esconda tudo até o 3D estar pronto */}
      <LoadingScreen />

      {/* CAMADA 2 (Meio): Interface e Menus */}
      {/* O Menu só aparece quando o estado for 'menu' */}
      {gameState.state === 'menu' && (
        <div className="absolute inset-0 z-50">
          <Menu />
        </div>
      )}

      {/* CAMADA 1 (Fundo): O Motor 3D */}
      {/* Ele NUNCA é desmontado. Se o jogo não estiver rodando ('playing'),
          nós apenas desativamos os cliques nele com pointer-events-none */}
      <div
        className={`absolute inset-0 z-0 ${gameState.state === 'playing' ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
      >
        <GameContainer />
      </div>

    </main>
  )
}
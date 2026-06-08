'use client'

import GameContainer from '@/components/game/GameContainer';
import Menu from '@/components/ui/Menu';
import { useGameStore } from '@/store/GameStore';
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import CRTFilter from '@/components/ui/CRTFilter';

export default function Home() {
  const gameState = useGameStore((state) => state.gameState)

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      <CRTFilter />
      {/* O Z-index altíssimo garante que ela esconda tudo até o 3D estar pronto */}
      <LoadingScreen />

      {gameState.state === 'menu' && (
        <div className="absolute inset-0 z-50">
          <Menu />
        </div>
      )}

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
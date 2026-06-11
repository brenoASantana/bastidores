'use client'

import GameContainer from '@/components/game/GameContainer';
import dynamic from 'next/dynamic';
import { useGameStore } from '@/store/GameStore';
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import CRTFilter from '@/components/ui/CRTFilter';

// O Next.js agora vai ignorar esse componente na hora do build no servidor
const Menu = dynamic(() => import('@/components/ui/Menu'), { ssr: false });

export default function Home() {
  const gameState = useGameStore((state) => state.gameState)

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      <CRTFilter />
      <LoadingScreen />

      {(gameState.state === 'menu' || gameState.state === 'failed' || gameState.state === 'completed') && (
        <div className="absolute inset-0 z-50">
          <Menu />
        </div>
      )}

      <div
        className={`absolute inset-0 z-0 ${gameState.state === 'playing' ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
      >
        <GameContainer />
      </div>

    </main>
  )
}
'use client'

import Menu from '@/components/Menu'
import { useGameStore } from '@/store/gameStore'
import dynamic from 'next/dynamic'
import { Suspense, useEffect } from 'react'

// Importa GameContainer de forma dinâmica para evitar SSR issues
const GameContainer = dynamic(() => import('@/components/game/GameContainer'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />,
})

export default function Home() {
  const gameState = useGameStore((state) => state.gameState)
  const setGameState = useGameStore((state) => state.setGameState)

  useEffect(() => {
    // Inicializa o jogo no estado de menu
    if (gameState.state === 'boot') {
      setGameState('menu')
    }
  }, [gameState.state, setGameState])

  return (
    <main className="w-screen h-screen overflow-hidden bg-black">
      {gameState.state === 'menu' && <Menu />}
      {gameState.state !== 'menu' && (
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
          <GameContainer />
        </Suspense>
      )}
    </main>
  )
}

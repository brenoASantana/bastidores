'use client'

import Menu from '@/components/Menu'
import GameContainer from '@/components/game/GameContainer'
import { useGameStore } from '@/store/gameStore'
import { useEffect } from 'react'

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
      {gameState.state !== 'menu' && <GameContainer />}
    </main>
  )
}

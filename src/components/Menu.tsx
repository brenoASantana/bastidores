'use client'

import React from 'react'
import { useGameStore } from '@/store/gameStore'

export default function Menu() {
  const store = useGameStore()
  const gameState = store.gameState

  const handleStartGame = () => {
    store.setGameState('playing')
  }

  const handleRestart = () => {
    store.resetGame()
    store.setGameState('menu')
  }

  const isGameOver = gameState.state === 'failed' || gameState.state === 'completed'

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-yellow-600 mb-4 letter-spacing font-serif">
          BACKROOMS
        </h1>

        <div className="text-xl text-gray-300 mb-8 font-mono">
          <p className="mb-4">Terror psicológico. Agorafobia. Vazio infinito.</p>
          <p className="text-sm text-gray-500">Você acordou em um lugar que não deveria existir.</p>
        </div>

        {!isGameOver ? (
          <>
            <button
              onClick={handleStartGame}
              className="px-8 py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-mono text-lg transition-colors mb-4"
            >
              ENTRAR
            </button>

            <div className="text-xs text-gray-600 mt-8 space-y-2">
              <p>CONTROLES:</p>
              <p>WASD/Setas - Movimento</p>
              <p>SHIFT - Correr</p>
              <p>Mouse - Olhar ao redor</p>
              <p className="mt-4 text-red-400">Colete 3 objetivos e encontre a saída.</p>
              <p className="text-red-600">Sua ansiedade destroirá sua mente.</p>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              {gameState.state === 'completed' ? (
                <>
                  <h2 className="text-3xl text-green-400 font-bold mb-4">VOCÊ ESCAPOU</h2>
                  <p className="text-gray-400">
                    Tempo: {(gameState.timeSpent / 1000).toFixed(1)}s
                  </p>
                  <p className="text-gray-400">Ansiedade final: {Math.round(gameState.anxiety)}/100</p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl text-red-500 font-bold mb-4">COLAPSO MENTAL</h2>
                  <p className="text-gray-400">Sua mente não resistiu ao vazio.</p>
                  <p className="text-gray-400">Objetivos: {gameState.objectives}/3</p>
                </>
              )}
            </div>

            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-mono text-lg transition-colors"
            >
              TENTAR NOVAMENTE
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');

        .letter-spacing {
          letter-spacing: 0.15em;
        }
      `}</style>
    </div>
  )
}

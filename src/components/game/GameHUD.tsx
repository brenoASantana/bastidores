'use client'

import React from 'react'
import { useGameStore } from '@/store/gameStore'

export default function GameHUD() {
  const gameState = useGameStore((state) => state.gameState)
  const anxiety = gameState.anxiety
  const objectives = gameState.objectives
  const maxObjectives = gameState.maxObjectives

  const anxietyPercent = (anxiety / 100) * 100
  const getAnxietyColor = () => {
    if (anxiety < 30) return '#00ff00'
    if (anxiety < 60) return '#ffaa00'
    return '#ff0000'
  }

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Barra de ansiedade (lado esquerdo inferior) */}
      <div className="absolute bottom-8 left-8 w-48">
        <div className="text-sm text-white mb-2 font-mono">ANSIEDADE</div>
        <div className="w-full h-4 bg-gray-900 border border-gray-700">
          <div
            className="h-full transition-all"
            style={{
              width: `${anxietyPercent}%`,
              backgroundColor: getAnxietyColor(),
            }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1 font-mono">{Math.round(anxiety)}/100</div>
      </div>

      {/* Contador de objetivos (lado direito inferior) */}
      <div className="absolute bottom-8 right-8">
        <div className="text-sm text-white mb-2 font-mono">OBJETIVOS</div>
        <div className="flex gap-2">
          {Array.from({ length: maxObjectives }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 border-2 flex items-center justify-center font-mono text-xs ${
                i < objectives
                  ? 'border-yellow-500 bg-yellow-900 text-yellow-200'
                  : 'border-gray-600 bg-gray-800 text-gray-600'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Indicador de respiração (centro inferior) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="text-xs text-gray-500 font-mono text-center">
          PRESSIONE CLICK PARA COMEÇAR
        </div>
      </div>

      {/* Instruções (topo) */}
      <div className="absolute top-8 left-8 text-gray-400 text-xs font-mono max-w-xs">
        <p>WASD/Setas: Mover | Shift: Correr | Mouse: Olhar</p>
        <p className="mt-2 text-red-400">Colete 3 objetivos e escape.</p>
      </div>

      {/* Efeito visual de distorção quando ansiedade alta */}
      {anxiety > 70 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,${
              (anxiety - 70) / 30 * 0.4
            }) 100%)`,
            animation: `pulse ${1 - anxiety / 200}s infinite`,
          }}
        />
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  )
}

'use client'

import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'

export function LoadingScreen() {
    const { progress, active } = useProgress()
    const [hidden, setHidden] = useState(false)

    // Precisamos puxar a função setGameState do Zustand
    const gameState = useGameStore((state) => state.gameState.state)
    const setGameState = useGameStore((state) => state.setGameState)

    useEffect(() => {
        let timeout: NodeJS.Timeout

        if (progress === 100 && !active) {
            // O delay de 1 segundo para a tela sumir
            timeout = setTimeout(() => {
                setHidden(true)

                if (gameState === 'boot') {
                    setGameState('menu')
                }
            }, 1000)
        }

        return () => {
            if (timeout) clearTimeout(timeout)
        }
    }, [progress, active, gameState, setGameState])

    if (hidden && gameState !== 'boot') return null

    return (
        <div
            className={`absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white font-mono transition-opacity duration-1000 ${progress === 100 ? 'opacity-0' : 'opacity-100'
                }`}
        >
            <div className="w-full max-w-md px-8 flex flex-col items-center">
                <h1 className="text-2xl text-yellow-700 tracking-[0.3em] mb-8 animate-pulse font-serif uppercase">
                    Inicializando Sistema
                </h1>

                <div className="w-full h-1 bg-gray-900 border border-gray-800 relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-yellow-600 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="w-full flex justify-between mt-4 text-xs text-gray-500">
                    <span>Carregando entidades...</span>
                    <span>{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    )
}
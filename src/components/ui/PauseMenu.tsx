'use client'

import { useGameStore } from '@/store/gameStore'
import { getAudioSystem } from '@/config/audioSystem'

export default function PauseMenu() {
  const setPaused = useGameStore((state) => state.setPaused)
  const setGameState = useGameStore((state) => state.setGameState)

  const handleResume = () => {
    setPaused(false)
  }

  const handleRestart = () => {
    setPaused(false)
    setGameState('playing')
    // Aqui você pode resetar a posição do jogador e a ansiedade futuramente
  }

  const handleQuit = () => {
    const audio = getAudioSystem()
    audio.stopAmbient()
    setPaused(false)
    setGameState('menu') // Volta para a tela inicial do jogo
  }

  return (
    <div id="pause-menu-container" className="w-full max-w-sm md:max-w-md p-6 bg-black/80">
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">

        {/* Efeito visual de ruído/glitch pode ser adicionado aqui depois */}
        <h1 className="mb-12 text-6xl font-mono font-bold text-white tracking-widest uppercase">
          Pausado
        </h1>

        <div className="flex flex-col gap-4 w-64">
          <button
            onClick={handleResume}
            className="px-6 py-3 font-mono text-lg text-white border-2 border-white hover:bg-white hover:text-black transition-colors duration-200"
          >
            Retornar
          </button>

          <button
            onClick={() => alert('Configurações em breve')}
            className="px-6 py-3 font-mono text-lg text-white border-2 border-white hover:bg-white hover:text-black transition-colors duration-200"
          >
            Configurações
          </button>

          <button
            onClick={handleRestart}
            className="px-6 py-3 font-mono text-lg text-white border-2 border-white hover:bg-red-900 hover:border-red-900 transition-colors duration-200"
          >
            Reiniciar
          </button>

          <button
            onClick={handleQuit}
            className="px-6 py-3 font-mono text-lg text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-black transition-colors duration-200 mt-4"
          >
            Sair do Jogo
          </button>
        </div>
      </div>
    </div>
  )
}
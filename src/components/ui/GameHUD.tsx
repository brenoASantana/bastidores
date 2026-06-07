'use client'

import AnxietyBar, { getAnxietyColor } from '@/components/ui/AnxietyBar'
import StaminaBar from '@/components/ui/StaminaBar';
import { useGameStore } from '@/store/GameStore'
import { useRef, useEffect } from 'react'

export default function GameHUD() {

  // Um hook para acessar a barra e o texto direto no HTML
  const barRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLDivElement | null>(null)
  const distortionStrengthRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Assinamos o Zustand para escutar a ansiedade silenciosamente
    const unsubscribe = useGameStore.subscribe(
      (state) => state.gameState.anxiety.level,
      (newLevel) => {
        // MUNDO IMPERATIVO: Manipulamos o DOM via Vanilla JS
        // SEM AVISAR O REACT, SEM RE-RENDER!
        const clampedAnxietyLevel = Math.max(0, Math.min(100, newLevel))
        const distortionStrength = Math.max(0, (clampedAnxietyLevel - 70) / 30)

        if (barRef.current) {
          barRef.current.style.width = `${newLevel}%`
          barRef.current.style.backgroundColor = `${getAnxietyColor(clampedAnxietyLevel)}`
        }
        if (textRef.current) {
          textRef.current.innerText = `${Math.round(newLevel)}/100`
          textRef.current.style.color = `${getAnxietyColor(clampedAnxietyLevel)}`
        }
        if (distortionStrengthRef.current) {
          distortionStrengthRef.current.style.opacity = `${distortionStrength}`
          distortionStrengthRef.current.style.background = `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,${distortionStrength * 0.4}) 100%)`
          distortionStrengthRef.current.style.animation = `pulse ${Math.max(0.3, 1 - clampedAnxietyLevel / 200)}s infinite`
        }
      }
    )

    return () => unsubscribe()
  }, []) // Array vazio! Esse effect roda UMA VEZ ao montar a tela.

  return (
    <>
      <AnxietyBar
        barRef={barRef}
        textRef={textRef}
        distortionStrengthRef={distortionStrengthRef}
      />
      <StaminaBar />
    </>
  )
}


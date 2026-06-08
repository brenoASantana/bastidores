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
      // 1. O que estamos observando:
      (state) => state.gameState.anxiety.level,

      // 2. O que acontece quando muda:
      (newLevel) => {
        // MUNDO IMPERATIVO: Manipulamos o DOM via Vanilla JS
        // SEM AVISAR O REACT, SEM RE-RENDER!
        const clampedAnxietyLevel = Math.max(0, Math.min(100, newLevel))

        // A distorção só começa a ganhar força quando passa dos 70%
        const distortionStrength = Math.max(0, (clampedAnxietyLevel - 70) / 30)

        // Atualiza a Barra (Tamanho e Cor)
        if (barRef.current) {
          barRef.current.style.width = `${newLevel}%`
          barRef.current.style.backgroundColor = `${getAnxietyColor(clampedAnxietyLevel)}`
        }

        // Atualiza o Texto Numérico
        if (textRef.current) {
          textRef.current.innerText = `${Math.round(newLevel)}/100`
          textRef.current.style.color = `${getAnxietyColor(clampedAnxietyLevel)}`
        }

        // Atualiza o Efeito de Vinheta/Distorção na tela toda
        if (distortionStrengthRef.current) {
          distortionStrengthRef.current.style.opacity = `${distortionStrength}`

          // Se a ansiedade estiver crítica (acima de 70%), mudamos o gradiente para um VERMELHO SANGUE pulsante
          if (clampedAnxietyLevel > 70) {
            const redIntensity = (clampedAnxietyLevel - 70) / 30; // Vai de 0 a 1

            distortionStrengthRef.current.style.background = `radial-gradient(ellipse at center, transparent 20%, rgba(139, 0, 0, ${redIntensity * 0.6}) 100%)`

            // Força o ritmo do pulso do filtro CRT a ficar frenético baseado no pânico
            const pulseSpeed = Math.max(0.15, 0.8 - (clampedAnxietyLevel / 100));
            distortionStrengthRef.current.style.animation = `pulse ${pulseSpeed}s infinite alternate`
          } else {
            // Com a ansiedade baixa, mantém o efeito de escuridão/túnel padrão do jogo
            distortionStrengthRef.current.style.background = `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${distortionStrength * 0.7}) 100%)`
            distortionStrengthRef.current.style.animation = `pulse ${Math.max(0.4, 1 - clampedAnxietyLevel / 200)}s infinite`
          }
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
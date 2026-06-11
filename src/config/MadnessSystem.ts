import { GAME, MADNESS } from '@/config/Constants';

export class MadnessSystem {
  private eventCooldowns: Map<string, number> = new Map()

  constructor() {
    this.initializeEventCooldowns()
  }

  private initializeEventCooldowns() {
    Object.values(MADNESS.EVENTS).forEach((eventId) => {
      this.eventCooldowns.set(eventId, 0)
    })
  }

  calculateAnxietyDelta(
    deltaTime: number,
    blockAnxietyMultiplier: number
  ): number {

    // Se o multiplicador for negativo ou zero, o bloco é uma zona segura! A ansiedade cai.
    if (blockAnxietyMultiplier <= 0) {
      return -GAME.ANXIETY.RATE_FALL * deltaTime * Math.abs(blockAnxietyMultiplier || 1)
    }

    // Se for um bloco normal ou assustador, a ansiedade sobe escalada pelo multiplicador
    return GAME.ANXIETY.RATE_RISE * deltaTime * blockAnxietyMultiplier
  }

  // Verifica se evento deve ser disparado
  shouldTriggerEvent(
    eventId: string,
    currentAnxiety: number,
    deltaTime: number
  ): boolean {
    const cooldown = this.eventCooldowns.get(eventId) || 0

    if (cooldown > 0) {
      this.eventCooldowns.set(eventId, cooldown - deltaTime)
      return false
    }

    // Probabilidade baseada em ansiedade
    const probability = (currentAnxiety / GAME.ANXIETY.LEVEL_MAX) * 0.05
    const shouldTrigger = Math.random() < probability

    if (shouldTrigger) {
      this.eventCooldowns.set(eventId, 20000) // 20 segundos de cooldown
      return true
    }

    return false
  }

  getVisualEffects(anxiety: number) {
    const normalizedAnxiety = anxiety / GAME.ANXIETY.LEVEL_MAX
    return {
      vignette: Math.min(0.4, normalizedAnxiety * 0.5),
      grain: Math.min(0.3, normalizedAnxiety * 0.4),
      chromaticAberration: Math.min(0.02, normalizedAnxiety * 0.025),
      blur: Math.min(0.5, normalizedAnxiety * 0.6),
      scale: 1 - normalizedAnxiety * 0.02,
    }
  }
}

export const madnessSystem = new MadnessSystem()
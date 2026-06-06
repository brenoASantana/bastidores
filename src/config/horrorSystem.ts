import { GAME_CONFIG, HORROR_EVENTS } from '@/data/constants'

export class HorrorSystem {
  private eventCooldowns: Map<string, number> = new Map()

  constructor() {
    this.initializeEventCooldowns()
  }

  private initializeEventCooldowns() {
    Object.values(HORROR_EVENTS).forEach((eventId) => {
      this.eventCooldowns.set(eventId, 0)
    })
  }

  // NOVA LÓGICA: Recebe apenas o Delta Time e o Multiplicador do Chão atual
  calculateAnxietyDelta(
    deltaTime: number,
    blockAnxietyMultiplier: number
  ): number {

    // Se o multiplicador for negativo ou zero, o bloco é uma zona segura! A ansiedade cai.
    if (blockAnxietyMultiplier <= 0) {
      // Usamos o Math.abs para garantir que a taxa de queda seja aplicada corretamente
      return -GAME_CONFIG.ANXIETY_FALL_RATE * deltaTime * Math.abs(blockAnxietyMultiplier || 1)
    }

    // Se for um bloco normal ou assustador, a ansiedade sobe escalada pelo multiplicador
    return GAME_CONFIG.ANXIETY_RISE_RATE * deltaTime * blockAnxietyMultiplier
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
    const probability = (currentAnxiety / GAME_CONFIG.MAX_ANXIETY) * 0.05
    const shouldTrigger = Math.random() < probability

    if (shouldTrigger) {
      this.eventCooldowns.set(eventId, 20000) // 20 segundos de cooldown
      return true
    }

    return false
  }
  
  getVisualEffects(anxiety: number) {
    const normalizedAnxiety = anxiety / GAME_CONFIG.MAX_ANXIETY
    return {
      vignette: Math.min(0.4, normalizedAnxiety * 0.5),
      grain: Math.min(0.3, normalizedAnxiety * 0.4),
      chromaticAberration: Math.min(0.02, normalizedAnxiety * 0.025),
      blur: Math.min(0.5, normalizedAnxiety * 0.6),
      scale: 1 - normalizedAnxiety * 0.02,
    }
  }
}

export const horrorSystem = new HorrorSystem()
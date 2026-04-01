import { GAME_CONFIG, MAP_CONFIG, HORROR_EVENTS } from '@/config/constants'
import type { HorrorEvent } from '@/types/game'

export class HorrorSystem {
  private anxietyRiseTimer: number = 0
  private eventCooldowns: Map<string, number> = new Map()
  private triggeredEvents: Set<string> = new Set()

  constructor() {
    this.initializeEventCooldowns()
  }

  private initializeEventCooldowns() {
    Object.values(HORROR_EVENTS).forEach((eventId) => {
      this.eventCooldowns.set(eventId, 0)
    })
  }

  // Calcula mudança de ansiedade baseado na posição e tempo
  calculateAnxietyDelta(
    playerPos: [number, number, number],
    deltaTime: number,
    isInSafeZone: boolean
  ): number {
    if (isInSafeZone) {
      return -GAME_CONFIG.ANXIETY_FALL_RATE * deltaTime
    }

    // Maior ansiedade em áreas abertas
    const distanceFromOrigin = Math.sqrt(playerPos[0] ** 2 + playerPos[2] ** 2)
    const isInOpenArea = distanceFromOrigin > MAP_CONFIG.OPEN_ZONE_RADIUS

    if (isInOpenArea) {
      return GAME_CONFIG.ANXIETY_RISE_RATE * deltaTime * 1.5
    }

    return GAME_CONFIG.ANXIETY_RISE_RATE * deltaTime
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

  // Detecta se jogador está em zona segura
  isInSafeZone(playerPos: [number, number, number]): boolean {
    const distanceFromOrigin = Math.sqrt(playerPos[0] ** 2 + playerPos[2] ** 2)
    return distanceFromOrigin < MAP_CONFIG.SAFE_ZONE_RADIUS
  }

  // Calcula efeitos visuais baseados em ansiedade
  getVisualEffects(anxiety: number) {
    const normalizedAnxiety = anxiety / GAME_CONFIG.MAX_ANXIETY

    return {
      vignette: Math.min(0.4, normalizedAnxiety * 0.5),
      grain: Math.min(0.3, normalizedAnxiety * 0.4),
      chromaticAberration: Math.min(0.02, normalizedAnxiety * 0.025),
      blur: Math.min(0.5, normalizedAnxiety * 0.6),
      scale: 1 - normalizedAnxiety * 0.02, // Leve zoom out de nervosismo
    }
  }
}

export const horrorSystem = new HorrorSystem()

import type { Player } from '@/types/game'

export interface Objective {
  id: number
  position: [number, number, number]
  radius: number
  collected: boolean
}

export class ObjectiveSystem {
  private objectives: Objective[] = []
  private maxObjectives: number = 3

  constructor() {
    this.generateObjectives()
  }

  private generateObjectives() {
    // Gera 3 objetivos em posições diferentes do mapa
    const positions: [number, number, number][] = [
      [8, 1.5, 5],
      [-10, 1.5, -15],
      [15, 1.5, 10],
    ]

    this.objectives = positions.map((pos, idx) => ({
      id: idx,
      position: pos,
      radius: 1.5,
      collected: false,
    }))
  }

  // Verifica se jogador colidiu com algum objetivo
  checkCollision(playerPos: [number, number, number]): number[] {
    const collected: number[] = []

    this.objectives.forEach((obj) => {
      if (!obj.collected) {
        const distance = Math.sqrt(
          Math.pow(playerPos[0] - obj.position[0], 2) +
            Math.pow(playerPos[1] - obj.position[1], 2) +
            Math.pow(playerPos[2] - obj.position[2], 2)
        )

        if (distance < obj.radius) {
          obj.collected = true
          collected.push(obj.id)
        }
      }
    })

    return collected
  }

  // Retorna objetivos para renderização
  getObjectives(): Objective[] {
    return [...this.objectives]
  }

  // Conta objetivos coletados
  getCollectedCount(): number {
    return this.objectives.filter((obj) => obj.collected).length
  }

  // Retorna primeira posição não-coletada (para renderização)
  getNextObjectivePosition(): [number, number, number] | null {
    const next = this.objectives.find((obj) => !obj.collected)
    return next ? next.position : null
  }

  // Reset para novo jogo
  reset() {
    this.generateObjectives()
  }
}

export const objectiveSystem = new ObjectiveSystem()

import { TEST_ROOM_LEVEL } from '@/components/config/levels'

export interface Objective {
  id: number
  position: [number, number, number]
  radius: number
  collected: boolean
}

export class ObjectiveSystem {
  private objectives: Objective[] = []

  constructor() {
    this.generateObjectives()
  }

  private generateObjectives() {
    this.objectives = TEST_ROOM_LEVEL.objectiveSpawns.map((spawn, idx) => ({
      id: idx,
      position: spawn.position,
      radius: spawn.radius,
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

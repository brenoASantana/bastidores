/// Constantes globais

// Gameplay
export const GAME_CONFIG = {
  MAX_ANXIETY: 100,
  ANXIETY_RISE_RATE: 0.5, // por segundo em área aberta
  ANXIETY_FALL_RATE: 0.15, // por segundo em zona segura
  ANXIETY_COLLAPSE_THRESHOLD: 95,
  ANXIETY_COLLAPSE_DURATION: 5000, // ms
  MAX_OBJECTIVES: 3,
}

// Player
export const PLAYER_CONFIG = {
  MOVE_SPEED: 4,
  SPRINT_MULTIPLIER: 1.5,
  MOUSE_SENSITIVITY: 0.003,
  COLLISION_RADIUS: 0.5,
}

// Audio
export const AUDIO_CONFIG = {
  MASTER_VOLUME: 0.8,
  AMBIENT_BASE: 0.4,
  TENSION_MIN: 0.1,
  TENSION_MAX: 0.7,
  SFX_VOLUME: 0.6,
}

// Horror Events
export const HORROR_EVENTS = {
  DISTANT_FOOTSTEPS: 'distant_footsteps',
  WHISPER: 'whisper',
  BUZZING_LIGHT: 'buzzing_light',
  BREATHING: 'breathing',
}

export const BLOCK_SIZE = 9 // Cada bloco tem 9x9 metros
export const WALL_HEIGHT = 4.5

export const WALLPAPER_URL = '/assets/textures/wallpaper/wallpaper_color.png'
export const CARPET_URL = '/assets/textures/carpet/carpet_color.png'
export const CEILING_URL = '/assets/textures/ceiling_tiles/ceiling_tiles_color.png'

export const INTENSITY_LIGHTS = 0.05
export const CREATOR = 'Breno Santana'

export const LAMP_URL = '/assets/textures/ceiling_tiles_2/ceiling_tiles_2_color.png'
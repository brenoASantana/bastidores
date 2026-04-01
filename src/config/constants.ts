/// Constantes globais e configurações

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
  MOVE_SPEED: 8,
  SPRINT_MULTIPLIER: 1.5,
  MOUSE_SENSITIVITY: 0.003,
  COLLISION_RADIUS: 0.5,
}

// Mapa
export const MAP_CONFIG = {
  CORRIDOR_WIDTH: 3,
  CORRIDOR_HEIGHT: 3,
  CORRIDOR_LENGTH: 20,
  WALL_THICKNESS: 0.5,
  SAFE_ZONE_RADIUS: 5,
  OPEN_ZONE_RADIUS: 15,
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

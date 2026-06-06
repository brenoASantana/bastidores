/**
 * CONFIGURAÇÕES GLOBAIS DO JOGO
 */

// 1. CRIADO
export const CREATOR = 'Breno Santana' as const;

// 2. WORLD E ENVIRONMENT (Física e Escala)
export const WORLD = {
  BLOCK_SIZE: 9,      // 9x9 metros
  WALL_HEIGHT: 4.5,   // Altura do pé-direito
  LIGHT_INTENSITY: 0.05,
} as const;

// 3. GAMEPLAY E MECÂNICAS
export const GAME = {
  ANXIETY: {
    MAX: 100,
    RISE_RATE: 0.5,
    FALL_RATE: 0.15,
    COLLAPSE_THRESHOLD: 95,
    COLLAPSE_DURATION: 5000, // ms
  },
  PLAYER: {
    MOVE_SPEED: 4,
    SPRINT_MULTIPLIER: 1.5,
    MOUSE_SENSITIVITY: 0.003,
    COLLISION_RADIUS: 0.5,
  },
} as const;

// 4. SISTEMA DE MADNESS
export const MADNESS = {
  EVENTS: {
    DISTANT_FOOTSTEPS: 'distant_footsteps',
    WHISPER: 'whisper',
    BUZZING_LIGHT: 'buzzing_light',
    BREATHING: 'breathing',
  },
  AUDIO_CONFIG: {
    MASTER_VOLUME: 0.8,
    AMBIENT_BASE: 0.4,
    TENSION_MIN: 0.1,
    TENSION_MAX: 0.7,
    SFX_VOLUME: 0.6,
  }
} as const;

// 5. ASSETS (Texturas e Áudio)
export const ASSETS = {
  TEXTURES: {
    WALLPAPER: '/assets/textures/wallpaper/wallpaper_color.png',
    CARPET: '/assets/textures/carpet/carpet_color.png',
    CEILING: '/assets/textures/ceiling_tiles/ceiling_tiles_color.png',
    LAMP: '/assets/textures/ceiling_tiles_2/ceiling_tiles_2_color.png',
    DEBUG: '/assets/textures/pool_tiles/pool_tiles_color.png',
  },
  AUDIO: {
    AMBIENT: {
      BASE: '/assets/audio/backrooms-ambience.mp3',
      MENU: '/assets/audio/music/overpopulation.mp3',
      SOUNDTRACK: '/assets/audio/music/Level_9_Darkened_Suburbs.mp3'
    },
    SFX: {
      FOOTSTEPS: '/assets/audio/sfx/action_footsteps_plastic.mp3',
      RUNNING: '/assets/audio/sfx/running-footsteps-sound-effect-hd.mp3',
      ENTER_BACKROOMS: '/assets/audio/sfx/enter-backrooms.mp3',
      // DISTANT_FOOTSTEPS: '/assets/audio/sfx/footsteps.mp3'
    },
    MADNESS: {
      WHISPER: '/assets/audio/madness/whisper.mp3'
    },
    ENTITY: {
      SCREAM: '/assets/audio/entity/backrooms-entity.mp3'
    }
  }
} as const;
/**
 * CONFIGURAÇÕES GLOBAIS DO JOGO
 */

// 1. CRIADOR
export const CREATOR = 'Breno Santana' as const;

// 2. WORLD E ENVIRONMENT (Física e Escala)
export const WORLD = {
  GRID_BLOCK_SIZE: 9,           // 9x9 metros
  STRUCTURE_WALL_HEIGHT: 4.5,   // Altura do pé-direito
  ENVIRONMENT_LIGHT_INTENSITY: 0.05,
} as const;

// 3. GAMEPLAY E MECÂNICAS
export const GAME = {
  ANXIETY: {
    LEVEL_MAX: 100,
    RATE_RISE: 0.5,
    RATE_FALL: 0.15,
    THRESHOLD_COLLAPSE: 95,
    DURATION_COLLAPSE_MS: 5000,
  },
  PLAYER: {
    SPEED_MOVE: 4,
    SPEED_SPRINT_MULTIPLIER: 1.5,
    INPUT_MOUSE_SENSITIVITY: 0.003,
    PHYSICS_COLLISION_RADIUS: 0.5,
  },
} as const;

// 4. SISTEMA DE MADNESS
export const MADNESS = {
  EVENTS: {
    FOOTSTEP_DISTANT: 'distant_footsteps',
    ENTITY_WHISPER: 'whisper',
    OBJECT_BUZZING_LIGHT: 'buzzing_light',
    PLAYER_BREATHING: 'breathing',
  },
  AUDIO_CONFIG: {
    VOLUME_MASTER: 0.8,
    VOLUME_AMBIENT_BASE: 0.4,
    TENSION_MIN: 0.1,
    TENSION_MAX: 0.7,
    VOLUME_SFX: 0.6,
  }
} as const;

// 5. ASSETS (Texturas e Áudio Otimizados)
export const ASSETS = {
  // Padrão: [SUBSTRATO]_[TIPO]_[DETALHE]
  TEXTURES: {
    WALLPAPER: '/assets/textures/wallpaper/wallpaper_color.png',
    CARPET: '/assets/textures/carpet/carpet_color.png',
    CEILING: '/assets/textures/ceiling_tiles/ceiling_tiles_color.png',
    LAMP: '/assets/textures/ceiling_tiles_2/ceiling_tiles_2_color.png',
    DEBUG: '/assets/textures/pool_tiles/pool_tiles_color.png',
  },

  AUDIO: {
    // 1. AMBIENT: Sons de fundo, loop infinito, streaming
    // Padrão: [TIPO]_[NOME_DO_LOCAL/OBJETO]
    AMBIENT: {
      BUZZING_LIGHT: '/assets/audio/ambient/buzzing_light.mp3',
      MUSIC_MENU_MAIN: '/assets/audio/ambient/overpopulation.mp3',
      MUSIC_LEVEL_SUBURBS: '/assets/audio/ambient/Level_9_Darkened_Suburbs.mp3'
    },

    // 2. SFX: Ações do jogador, mecânicas (não-loop, curtos)
    // Padrão: [ATOR]_[ACAO]_[MATERIAL]
    SFX: {
      PLAYER_FOOTSTEP_WALK: '/assets/audio/sfx/player_footstep_walk.mp3',
      PLAYER_FOOTSTEP_RUN: '/assets/audio/sfx/player_footstep_run.mp3',
      PLAYER_TRANSITION_ENTER: '/assets/audio/sfx/enter-backrooms.mp3',
    },

    // 3. EVENTS: Sons pontuais de entidades ou terror (one-shot)
    // Padrão: [FONTE]_[TIPO_DE_SOM]
    EVENTS: {
      ENTITY_WHISPER: '/assets/audio/events/whisper.mp3',
      ENTITY_SCREAM: '/assets/audio/events/entity_scream.mp3'
    }
  }
} as const;
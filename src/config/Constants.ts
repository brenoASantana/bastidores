/**
 * CONFIGURAÇÕES GLOBAIS DO JOGO
 */

// 1. CRIADOR
export const CREATOR = 'Breno Santana' as const;

// 2. WORLD E ENVIRONMENT (Física e Escala)
export const WORLD = {
  GRID_BLOCK_SIZE: 3,           // 9x9 metros
  STRUCTURE_WALL_HEIGHT: 4.5,   // Altura do pé-direito
  ENVIRONMENT_LIGHT_INTENSITY: 9,
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
    SPEED_MOVE: 5,
    SPEED_SPRINT_MULTIPLIER: 1.5,
    INPUT_MOUSE_SENSITIVITY: 0.003,
    PHYSICS_COLLISION_RADIUS: 0.5,
    STAMINA_MAX: 100, // Limite de fôlego
    STAMINA_DEPLETION_RATE: 25, // Gasta 25 pontos por segundo correndo (Dura 4 segundos de corrida direto)
    STAMINA_REGEN_RATE: 15, // Recupera 15 pontos por segundo andando/parado (Demora ~6.5 segundos para encher)
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
    WALLPAPER: '/assets/textures/wallpaper_color.webp',
    CARPET: '/assets/textures/carpet_color.webp',
    CEILING: '/assets/textures/ceiling_tiles_color.webp',
    LAMP: '/assets/textures/ceiling_tiles_2_color.webp',
    GLASS: '/assets/textures/texturelabs_glass_135m-convertido-de-jpg.webp',
    EXIT: '/assets/textures/pool_tiles_color-convertido-de-png.webp',
    DOORWAY: '/assets/textures/doorway-convertido-de-jpg.webp',
  },

  AUDIO: {
    // 1. AMBIENT: Sons de fundo, loop infinito, streaming
    // Padrão: [TIPO]_[NOME_DO_LOCAL/OBJETO]
    AMBIENT: {
      MUSIC_MENU_MAIN: '/assets/audio/ambient/overpopulation.ogg',
      MUSIC_LEVEL_SUBURBS: '/assets/audio/ambient/level_9_darkened_suburbs.ogg'
    },

    // 2. SFX: Ações do jogador, mecânicas (não-loop, curtos)
    // Padrão: [ATOR]_[ACAO]_[MATERIAL]
    SFX: {
      PLAYER_FOOTSTEP_WALK: '/assets/audio/sfx/player_footstep_walk.ogg',
      PLAYER_FOOTSTEP_RUN: '/assets/audio/sfx/player_footstep_run.ogg',
      PLAYER_TRANSITION_ENTER: '/assets/audio/sfx/enter-backrooms.ogg',
      BUZZING_LIGHT: '/assets/audio/ambient/buzzing_light.ogg',
    },

    // 3. EVENTS: Sons pontuais de entidades ou terror (one-shot)
    // Padrão: [FONTE]_[TIPO_DE_SOM]
    EVENTS: {
      ENTITY_WHISPER: '/assets/audio/events/whisper.ogg',
      ENTITY_SCREAM: '/assets/audio/events/entity_scream.ogg',
    },

  },
} as const;
import { CARPET_URL, WALLPAPER_URL } from '@/config/constants';

export const metadata = {
  "0": {
    "nome": "Chão",
    "walkable": true,
    "transparent": true,
    "texture": CARPET_URL, // URL da sua imagem
    "color": '#ffffff', // Usamos branco para a textura não ficar tingida
    "anxietyMultiplier": 1.0
  },
  "1": {
    "nome": "Parede",
    "walkable": false,
    "transparent": false,
    "texture": WALLPAPER_URL, // URL da sua imagem
    "color": '#ffffff', // Usamos branco para a textura não ficar tingida
    "anxietyMultiplier": 1.0
  },
  "2": {
    "nome": "Passagem",
    "walkable": true,
    "transparent": true,
    "texture": WALLPAPER_URL, // URL da sua imagem
    "color": '#ffffff', // Usamos branco para a textura não ficar tingida
    "anxietyMultiplier": 1.0
  },
  "3": {
    "nome": "Sem Saída",
    "walkable": true,
    "transparent": true,
    "texture": WALLPAPER_URL, // URL da sua imagem
    "color": '#ffffff', // Usamos branco para a textura não ficar tingida
    "anxietyMultiplier": 2.5
  },
  "4": {
    "nome": "Buraco",
    "walkable": false,
    "transparent": true,
    "texture": WALLPAPER_URL, // URL da sua imagem
    "color": '#ffffff', // Usamos branco para a textura não ficar tingida
    "anxietyMultiplier": 1.0
  },
  "5": {
    "nome": "Vidro",
    "walkable": false,
    "transparent": true,
    "texture": WALLPAPER_URL, // URL da sua imagem
    "color": '#ffffff', // Usamos branco para a textura não ficar tingida
    "anxietyMultiplier": 1.0
  }
};
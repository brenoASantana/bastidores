import { CARPET_URL, CEILING_URL, WALLPAPER_URL } from '@/config/constants'
import { useTexture } from '@react-three/drei'

export function AssetLoader() {
  useTexture.preload(WALLPAPER_URL)
  useTexture.preload(CARPET_URL)
  useTexture.preload(CEILING_URL)
  return null // Não renderiza nada, apenas carrega as texturas
}

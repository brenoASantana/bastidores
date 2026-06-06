import { useTexture } from '@react-three/drei'
import { WALLPAPER_URL, CARPET_URL, CEILING_URL } from '@/data/constants'

export function AssetLoader() {
  useTexture.preload(WALLPAPER_URL)
  useTexture.preload(CARPET_URL)
  useTexture.preload(CEILING_URL)
  return null // Não renderiza nada, apenas carrega as texturas
}

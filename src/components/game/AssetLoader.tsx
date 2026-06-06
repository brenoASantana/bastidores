import { useTexture } from '@react-three/drei'
import { WALLPAPER_URL } from '@/data/constants'

export function AssetLoader() {
  useTexture.preload(WALLPAPER_URL)
  // useTexture.preload('/textures/Floor.png')
  // ... todos os outros
  return null // Não renderiza nada, apenas carrega as texturas
}

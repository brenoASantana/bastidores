import { ASSETS } from '@/config/Constants'
import { useTexture } from '@react-three/drei'

export function AssetLoader() {
  useTexture.preload(ASSETS.TEXTURES.WALLPAPER)
  useTexture.preload(ASSETS.TEXTURES.CARPET)
  useTexture.preload(ASSETS.TEXTURES.CEILING)
  useTexture.preload(ASSETS.TEXTURES.LAMP)
  useTexture.preload(ASSETS.TEXTURES.DEBUG)
  return null // Não renderiza nada, apenas carrega as texturas
}

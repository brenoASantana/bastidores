import { useTexture } from '@react-three/drei'

// 1. Componente que SEMPRE chama o hook (usado apenas quando há textura)
function TexturedBlock({ url, color }: { url: string, color: string }) {
  const texture = useTexture(url)

  // Ajuste Retro
  texture.magFilter = 1003
  texture.minFilter = 1003

  return (
    <meshLambertMaterial
      map={texture}
      color={color}
    />
  )
}

// 2. Componente que NÃO chama hook nenhum (usado quando NÃO há textura)
function PlainBlock({ color }: { color: string }) {
  return <meshBasicMaterial color={color} />
}

// 3. O componente "Factory" que escolhe qual renderizar
export function Block({ textureUrl, color }: { textureUrl?: string, color: string }) {
  // A decisão é tomada aqui, na escolha do componente, e não dentro do hook!
  if (textureUrl) {
    return <TexturedBlock url={textureUrl} color={color} />
  }

  return <PlainBlock color={color} />
}
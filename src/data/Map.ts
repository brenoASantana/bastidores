// 0: Carpete
// 1: Parede
// 3: Sem-Saida (Para texturas de beco)
// 4: Buraco (Ameaça)
// 8: Spawn
// 9: Saida

export const mapMatrix = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 0, 0, 1, 0, 0, 0, 0, 1, 0, 8, 1], // Início: zigue-zague obrigatório (caminho para baixo é isca)
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1], // Bifurcações cegas
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1], // Bloqueio central denso divide o mapa
  [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 3, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 4, 1], // Se desceu pelo lado direito, cai num buraco surpresa
  [1, 4, 4, 0, 1, 0, 1, 1, 0, 3, 1, 0, 1], // Parede falsa e buracos à esquerda
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 4, 1, 0, 1],
  [1, 0, 1, 1, 1, 4, 4, 0, 1, 0, 0, 0, 1], // Sala central perigosa
  [1, 0, 1, 3, 1, 0, 0, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 3, 0, 1, 1, 3, 3, 0, 1], // Becos sem saída claustrofóbicos (1x1)
  [1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1], // O grande corredor transversal
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1], // A "Parede da Frustração" que esconde e bloqueia a saída
  [1, 9, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 1], // Saída escondida no final do recuo
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
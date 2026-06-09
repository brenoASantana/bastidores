import { GameButton } from "./GameButton";

interface StartScreenProps {
  onStart: () => void;
  onCredits: () => void;
  onHowToPlay: () => void;
}

export const StartScreen = ({ onStart, onCredits, onHowToPlay }: StartScreenProps) => (
  // 1. Container Flex Centralizado
  <div className="flex flex-col items-center justify-center w-full max-w-md z-10">

    {/* 2. CAIXA FANTASMA: Segura o espaço físico do título para os botões não pularem */}
    <div className="relative mb-12 h-20 flex items-center justify-center w-full pointer-events-none">

      {/* O título agora é absoluto: viaja pela tela mas o "ponto zero" dele é o centro! */}
      <h1 className="fnaf-title-glitch absolute text-5xl md:text-7xl font-bold text-yellow-600 tracking-widest uppercase font-serif whitespace-nowrap"
        data-text="Bastidores">
        Bastidores
      </h1>

    </div>

    {/* 3. Botões */}
    <div className="flex flex-col items-center w-full gap-4 pointer-events-auto">
      <GameButton onClick={onStart}>Iniciar</GameButton>
      <GameButton
        onClick={onHowToPlay}
        className="w-full py-3 border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition-all font-mono uppercase tracking-widest text-sm"
      >
        Como Jogar
      </GameButton>
      <GameButton onClick={onCredits} variant="outline">Créditos</GameButton>
    </div>

  </div>
);
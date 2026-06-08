import { GameButton } from "./GameButton";

interface StartScreenProps {
  onStart: () => void;
  onCredits: () => void;
  onHowToPlay: () => void;
}

export const StartScreen = ({ onStart, onCredits, onHowToPlay }: StartScreenProps) => (
  <div className="text-center max-w-md">
    <h1 className="text-5xl font-bold text-yellow-600 mb-4 font-serif">Bastidores</h1>

    <div className="flex flex-col items-center gap-4">
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
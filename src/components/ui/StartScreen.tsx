import { GameButton } from "./GameButton";

interface StartScreenProps {
  onStart: () => void;
  onCredits: () => void;
}

export const StartScreen = ({ onStart, onCredits }: StartScreenProps) => (
  <div className="text-center max-w-md">
    <h1 className="text-5xl font-bold text-yellow-600 mb-4 font-serif">Bastidores</h1>

    <div className="flex flex-col items-center gap-4">
      <GameButton onClick={onStart}>INICIAR</GameButton>
      <GameButton onClick={onCredits} variant="outline">CRÉDITOS</GameButton>
    </div>
  </div>
);
import { GameButton } from "./GameButton";

interface StartScreenProps {
  onStart: () => void;
  onCredits: () => void;
}

export const StartScreen = ({ onStart, onCredits }: StartScreenProps) => (
  <div className="flex flex-col items-center justify-center w-full max-w-md z-10">

    <div className="relative mb-12 h-20 flex items-center justify-center w-full pointer-events-none">

      <h1 className="fnaf-title-glitch absolute text-5xl md:text-7xl font-bold text-yellow-600 tracking-widest uppercase font-serif whitespace-nowrap"
        data-text="Bastidores">
        BASTIDORES
      </h1>

    </div>

    <div className="flex flex-col items-center w-full gap-4 pointer-events-auto">
      <GameButton onClick={onStart}>INICIAR</GameButton>
      <GameButton onClick={onCredits} variant="outline">CRÉDITOS</GameButton>
    </div>

  </div>
);
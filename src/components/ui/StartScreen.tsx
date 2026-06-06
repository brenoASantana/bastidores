import { GameButton } from "./GameButton";

interface StartScreenProps {
  onStart: () => void;
  onCredits: () => void;
}

export const StartScreen = ({ onStart, onCredits }: StartScreenProps) => (
  <div className="text-center max-w-md">
    <h1 className="text-5xl font-bold text-yellow-600 mb-4 font-serif">Bastidores</h1>
    <div className="text-xl text-gray-300 mb-8 font-mono">
      <p className="mb-4">Terror psicológico. Agorafobia. Vazio infinito.</p>
    </div>

    {/* Agrupando os botões */}
    <div className="flex flex-col items-center gap-4">
      <GameButton onClick={onStart}>ENTRAR NO VAZIO</GameButton>
      <GameButton onClick={onCredits} variant="outline">CRÉDITOS</GameButton>
    </div>
  </div>
);
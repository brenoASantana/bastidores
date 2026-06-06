import { GameButton } from "./GameButton";

export const StartScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="text-center max-w-md">
    <h1 className="text-5xl font-bold text-yellow-600 mb-4 font-serif">Bastidores</h1>
    <div className="text-xl text-gray-300 mb-8 font-mono">
      <p className="mb-4">Terror psicológico. Agorafobia. Vazio infinito.</p>
    </div>
    <GameButton onClick={onStart}>ENTRAR</GameButton>
  </div>
);
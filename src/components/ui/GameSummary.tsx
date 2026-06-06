import { GameOverState } from '@/utils/game';
import { GameButton } from "./GameButton";

// Definimos o contrato do componente aqui
interface GameSummaryProps {
    state: GameOverState; // Usa o tipo restrito
    time: number;
    onRestart: () => void;
}

export const GameSummary = ({ state, time, onRestart }: GameSummaryProps) => (
    <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-4 ${state === 'completed' ? 'text-green-400' : 'text-red-500'}`}>
            {state === 'completed' ? 'VOCÊ ESCAPOU' : 'COLAPSO MENTAL'}
        </h2>
        <p className="text-gray-400">Tempo: {(time / 1000).toFixed(1)}s</p>

        <GameButton onClick={onRestart} variant="primary">
            TENTAR NOVAMENTE
        </GameButton>
    </div>
);
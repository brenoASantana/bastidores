'use client'

import { GameOverState } from "@/utils/Game";

interface GameSummaryProps {
    state: GameOverState;
    time: number;
    onContinue: () => void;
}

export function GameSummary({ state, time, onContinue }: GameSummaryProps) {
    // Verifica se o jogador ganhou ou perdeu para mudar as cores e os textos
    const isVictory = state === 'completed';

    // Função para transformar 125000 milissegundos em "02:05"
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // padStart garante que "5" segundos apareça como "05"
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`flex flex-col items-center justify-center p-8 md:p-12 border-2 max-w-lg w-full text-center space-y-8 font-mono relative z-50 pointer-events-auto backdrop-blur-md ${isVictory
                ? 'border-yellow-600/50 bg-yellow-950/40 shadow-[0_0_30px_rgba(161,98,7,0.3)]'
                : 'border-red-800 bg-red-950/60 shadow-[0_0_50px_rgba(153,27,27,0.5)]'
            }`}>

            {/* Efeito de Glitch/Scanlines interno apenas na caixa */}
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" />

            {/* TÍTULO PRINCIPAL */}
            <h1 className={`text-5xl md:text-6xl tracking-[0.2em] uppercase font-bold flex-shrink-0 ${isVictory
                    ? 'text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]'
                    : 'text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.9)] animate-pulse'
                }`}>
                {isVictory ? 'Sobreviveu' : 'Game Over'}
            </h1>

            {/* RELATÓRIO DO SISTEMA */}
            <div className="w-full space-y-6 bg-black/50 p-6 border border-white/10">

                {/* Status da Missão */}
                <div>
                    <h3 className="text-gray-500 text-xs md:text-sm uppercase tracking-widest mb-1">Status da Anomalia</h3>
                    <p className={`text-lg md:text-xl ${isVictory ? 'text-yellow-400' : 'text-red-500'}`}>
                        {isVictory ? 'Fuga bem-sucedida.' : 'Colapso mental. Sinais vitais perdidos.'}
                    </p>
                </div>

                {/* Tempo de Sobrevivência */}
                <div>
                    <h3 className="text-gray-500 text-xs md:text-sm uppercase tracking-widest mb-1">Tempo de Exposição</h3>
                    <p className="text-3xl md:text-4xl text-white tracking-widest">
                        {formatTime(time)}
                    </p>
                </div>

            </div>

            {/* BOTÃO DE PROSSEGUIR */}
            <div className="pt-4 w-full">
                <button
                    onClick={onContinue}
                    className={`w-full py-4 border-2 transition-all duration-300 uppercase font-bold tracking-[0.2em] text-sm md:text-base ${isVictory
                            ? 'border-yellow-600/50 text-yellow-500 hover:bg-yellow-600 hover:text-black hover:shadow-[0_0_15px_rgba(234,179,8,0.6)]'
                            : 'border-red-800/80 text-red-500 hover:bg-red-800 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.8)]'
                        }`}
                >
                    PROSSEGUIR
                </button>
            </div>

        </div>
    );
}
'use client'

import { GAME } from '@/config/Constants';
import { useGameStore } from '@/store/GameStore';

export default function StaminaBar() {
    // Lê a estamina em tempo real da Store
    const stamina = useGameStore((state) => state.player.stamina);

    // Calcula a porcentagem para preencher a barra (0 a 100)
    const percentage = Math.max(0, Math.min(100, (stamina / GAME.PLAYER.STAMINA_MAX) * 100));

    // Truque de Game Design: A barra fica invisível quando a estamina está cheia
    // para deixar a tela limpa, e só aparece quando o jogador começa a cansar.
    const isFull = stamina >= GAME.PLAYER.STAMINA_MAX;

    return (
        <div
            className={`fixed bottom-10 right-10 w-48 md:w-64 flex flex-col items-end pointer-events-none transition-opacity duration-500 ${isFull ? 'opacity-0' : 'opacity-100'
                }`}
        >
            <span className="text-white/70 text-xs font-mono tracking-widest uppercase mb-2">
                Fôlego
            </span>

            {/* Container da Barra (Fundo escuro) */}
            <div className="w-full h-2 bg-black/50 border border-white/20">
                {/* O Preenchimento da Barra (Branco ou Vermelho se estiver acabando) */}
                <div
                    className={`h-full transition-all duration-100 ease-linear ${percentage < 20 ? 'bg-red-600 animate-pulse' : 'bg-white/80'
                        }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
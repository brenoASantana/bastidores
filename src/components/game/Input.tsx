import { useEffect } from "react";
import { useGameStore } from '@/store/GameStore'

export const keysPressed: Record<string, boolean> = {}

export function Input() {
    // Adicione isso no topo do seu Game.tsx ou no seu arquivo de input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                const state = useGameStore.getState();
                state.setPaused(!state.gameState.isPaused);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
}
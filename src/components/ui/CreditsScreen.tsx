import { CREATOR } from '@/config/constants';
import { GameButton } from "./GameButton";

interface CreditsScreenProps {
    onBack: () => void;
}

export const CreditsScreen = ({ onBack }: CreditsScreenProps) => (
    <div className="text-center max-w-2xl px-6">
        <h1 className="text-4xl font-bold text-yellow-600 mb-8 font-serif tracking-widest">CRÉDITOS</h1>

        <div className="space-y-8 text-gray-300 font-mono mb-12 text-left bg-black/50 p-8 border border-gray-800">

            {/* Sua Assinatura Digital */}
            <div>
                <h3 className="text-xl text-white mb-2 border-b border-gray-700 pb-1">DIREÇÃO E DESENVOLVIMENTO</h3>
                <p className="text-yellow-500 font-bold text-lg">{CREATOR}</p>
                <p className="text-sm text-gray-500 mt-1">Engenharia de Software, Arquitetura e Level Design</p>
            </div>


            {/* Créditos das Texturas (OpenGameArt) */}
            <div>
                <h3 className="text-xl text-white mb-2 border-b border-gray-700 pb-1">ARTE VISUAL & TEXTURAS</h3>
                <p className="text-gray-300">Backrooms PBR Texture Pack</p>
                <p className="text-sm text-gray-400 mt-1">
                    Criado por <a href="https://opengameart.org/content/backrooms-pbr-texture-pack" target="_blank" rel="noreferrer" className="text-yellow-600 hover:underline">methodical pixel</a> (OpenGameArt.org)
                </p>
                <p className="text-xs text-gray-600 mt-1">Licença: Domínio Público (CC0)</p>
            </div>

            {/* Ferramentas */}
            <div>
                <h3 className="text-xl text-white mb-2 border-b border-gray-700 pb-1">TECNOLOGIAS</h3>
                <p className="text-sm text-gray-400">React Three Fiber, Next.js, Zustand e Tailwind CSS</p>
            </div>
        </div>

        <p className="text-xs text-gray-600 mt-4">
            &copy; {new Date().getFullYear()} {CREATOR}. Todos os direitos reservados.
        </p>

        <GameButton onClick={onBack} variant="outline">
            VOLTAR AO MENU
        </GameButton>
    </div>
);
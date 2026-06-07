import { CREATOR } from '@/config/Constants';
import { GameButton } from "./GameButton";

interface CreditsScreenProps {
    onBack: () => void;
}

export default function CreditsScreen({ onBack }: CreditsScreenProps) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black font-mono relative overflow-y-auto py-12">

            {/* Título da Tela */}
            <h1 className="text-4xl text-yellow-700 tracking-[0.3em] mb-8 uppercase animate-pulse">
                Créditos do Sistema
            </h1>

            {/* Caixa de Conteúdo */}
            <div className="w-full max-w-2xl text-center space-y-10 bg-black/50 p-8 border border-gray-800 mb-20">

                {/* Seção 1: Direção e Desenvolvimento */}
                <div>
                    <h3 className="text-xl text-white mb-2 border-b border-gray-700 pb-1 inline-block px-8">DIREÇÃO E ENGENHARIA</h3>
                    <p className="text-yellow-500 font-bold text-lg mt-4">{CREATOR}</p>
                    <p className="text-sm text-gray-500 mt-1">Arquitetura de Software, Level Design e Programação</p>
                </div>

                {/* Seção 2: Arte Visual (OpenGameArt) */}
                <div>
                    <h3 className="text-xl text-white mb-2 border-b border-gray-700 pb-1 inline-block px-8">ARTE VISUAL & TEXTURAS</h3>
                    <p className="text-gray-300 mt-4">Backrooms PBR Texture Pack</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Criado por <a href="https://opengameart.org/content/backrooms-pbr-texture-pack" target="_blank" rel="noreferrer" className="text-yellow-600 hover:underline">methodical pixel</a> (OpenGameArt)
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Licença: Domínio Público (CC0)</p>
                </div>

                {/* Seção 3: Design Sonoro */}
                <div>
                    <h3 className="text-xl text-white mb-2 border-b border-gray-700 pb-1 inline-block px-8">DESIGN SONORO</h3>

                    <div className="mt-4 mb-6">
                        <p className="text-yellow-500 font-bold text-md">Trilha Sonora (Curadoria Spotify)</p>
                        <ul className="text-sm text-gray-400 mt-2 space-y-1">
                            <li>overpopulation at the end of everything is less of a worry, haha (a letter to you from mother 3) - No Love In The House Of Gold</li>
                            <li>Level 9 Darkened SuburbsLevel 9 Darkened Suburbs - Iwakura</li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-yellow-500 font-bold text-md">Efeitos Especiais (SFX)</p>
                        <p className="text-sm text-gray-400 mt-2">
                            Comunidade <span className="text-gray-300">MyInstants</span> (Pacotes Backrooms)<br />
                            <span className="text-xs text-gray-600 mt-1 block">Sons de ambiente, estática e anomalias.</span>
                        </p>
                    </div>
                </div>

                {/* Seção 4: Tecnologias */}
                <div>
                    <h3 className="text-xl text-white mb-2 border-b border-gray-700 pb-1 inline-block px-8">TECNOLOGIAS</h3>
                    <p className="text-sm text-gray-400 mt-4">React Three Fiber, Next.js, Zustand e Tailwind CSS</p>
                </div>

            </div>

            {/* Rodapé Dinâmico (Fixo embaixo) */}
            <div className="absolute bottom-6 flex flex-col items-center bg-black/90 px-8 py-2">
                <p className="text-xs text-gray-600 mb-4">
                    &copy; {new Date().getFullYear()} {CREATOR}. Todos os direitos reservados.
                </p>

                {/* Voltamos a usar o seu GameButton! */}
                <GameButton onClick={onBack} variant="outline">
                    VOLTAR AO MENU
                </GameButton>
            </div>

        </div>
    )
}
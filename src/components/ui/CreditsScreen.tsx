import { CREATOR } from '@/config/Constants';
import { GameButton } from "./GameButton";

interface CreditsScreenProps {
    onBack: () => void;
}

export default function CreditsScreen({ onBack }: CreditsScreenProps) {
    return (
        // 1. Contêiner Absoluto com Scroll: Pegamos a tela toda e liberamos a barra de rolagem
        <div className="absolute inset-0 w-full h-full overflow-y-auto pointer-events-auto bg-transparent scroll-smooth">

            {/* 2. Fluxo Normal: Sem justify-center. Usamos py-16 (padding) para dar um respiro elegante no topo e embaixo */}
            <div className="flex flex-col items-center min-h-full w-full py-16 px-4">

                {/* Título da Tela */}
                <h1 className="text-3xl md:text-4xl text-yellow-700 tracking-[0.2em] md:tracking-[0.3em] mb-6 md:mb-8 uppercase animate-pulse flex-shrink-0 text-center">
                    Créditos do Sistema
                </h1>

                {/* Caixa de Conteúdo */}
                <div className="w-full max-w-2xl text-center space-y-8 md:space-y-10 bg-black/50 p-4 md:p-8 border border-gray-800 flex-shrink-0 break-words mb-6">

                    {/* Seção 1: Direção e Desenvolvimento */}
                    <div>
                        <h3 className="text-lg md:text-xl text-white mb-2 border-b border-gray-700 pb-1 inline-block px-4 md:px-8">DIREÇÃO E ENGENHARIA</h3>
                        <p className="text-yellow-500 font-bold text-lg mt-4">{CREATOR}</p>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">Arquitetura de Software, Level Design e Programação</p>
                    </div>

                    {/* Seção 2: Arte Visual */}
                    <div>
                        <h3 className="text-lg md:text-xl text-white mb-2 border-b border-gray-700 pb-1 inline-block px-4 md:px-8">ARTE VISUAL & TEXTURAS</h3>
                        <p className="text-gray-300 mt-4 text-sm md:text-base">Backrooms PBR Texture Pack</p>
                        <p className="text-xs md:text-sm text-gray-400 mt-1">
                            Criado por <a href="https://opengameart.org/content/backrooms-pbr-texture-pack" target="_blank" rel="noreferrer" className="text-yellow-600 hover:underline">methodical pixel</a> (OpenGameArt)
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Licença: Domínio Público (CC0)</p>
                    </div>

                    {/* Seção 3: Design Sonoro */}
                    <div>
                        <h3 className="text-lg md:text-xl text-white mb-2 border-b border-gray-700 pb-1 inline-block px-4 md:px-8">DESIGN SONORO</h3>

                        <div className="mt-4 mb-6">
                            <p className="text-yellow-500 font-bold text-sm md:text-md">
                                Trilha Sonora Original por <a href="https://on.soundcloud.com/5ZPJUQyasB6VKll62w" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-white hover:underline transition-colors">Elias Ledger</a>
                            </p>
                            <ul className="text-xs md:text-sm text-gray-400 mt-2 space-y-2 px-2">
                                <li>A Lie - Elias Ledger</li>
                                <li>False Memory - Elias Ledger</li>
                            </ul>
                        </div>

                        <div>
                            <p className="text-yellow-500 font-bold text-sm md:text-md">Efeitos Especiais (SFX)</p>
                            <p className="text-xs md:text-sm text-gray-400 mt-2">
                                Comunidade <span className="text-gray-300">MyInstants</span> (Pacotes Backrooms)<br />
                                <span className="text-[10px] md:text-xs text-gray-600 mt-1 block">Sons de ambiente, estática e anomalias.</span>
                            </p>
                        </div>
                    </div>

                    {/* Seção 4: Tecnologias */}
                    <div>
                        <h3 className="text-lg md:text-xl text-white mb-2 border-b border-gray-700 pb-1 inline-block px-4 md:px-8">TECNOLOGIAS</h3>
                        <p className="text-xs md:text-sm text-gray-400 mt-4">React Three Fiber, Next.js, Zustand e Tailwind CSS</p>
                    </div>

                </div>

                {/* 3. Rodapé isolado e centralizado no fluxo */}
                <div className="w-full max-w-2xl flex flex-col items-center bg-black/90 px-4 py-6 border border-gray-900 flex-shrink-0">
                    <p className="text-[10px] md:text-xs text-gray-600 mb-6 text-center">
                        &copy; {new Date().getFullYear()} {CREATOR}. Todos os direitos reservados.
                    </p>

                    <GameButton onClick={onBack} variant="outline">
                        VOLTAR AO MENU
                    </GameButton>
                </div>

            </div>
        </div>
    )
}
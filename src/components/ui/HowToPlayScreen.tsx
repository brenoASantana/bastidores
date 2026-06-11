'use client'

interface HowToPlayScreenProps {
  onContinue: () => void;
}

export default function HowToPlayScreen({ onContinue }: HowToPlayScreenProps) {
  const commands = [
    { keys: ['W', 'A', 'S', 'D'], action: 'Movimentação básica pelo labirinto' },
    { keys: ['Shift'], action: 'Correr (Gasta fôlego/estamina rapidamente)' },
    { keys: ['Mouse'], action: 'Olhar ao redor (Movimenta a visão em primeira pessoa)' },
    { keys: ['ESC'], action: 'Pausar o jogo / Menu do Sistema' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-white/20 bg-black/80 max-w-xl w-full text-left space-y-6 font-mono backdrop-blur-md shadow-[0_0_40px_rgba(255,255,255,0.05)]">

      <h2 className="text-2xl text-white tracking-[0.3em] uppercase font-bold text-center border-b border-white/10 pb-4 w-full">
        Protocolo de Operação
      </h2>

      <div className="w-full space-y-4 py-2">
        {commands.map((cmd, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 last:border-0">
            {/* Teclas Estilizadas */}
            <div className="flex gap-1.5 mb-2 sm:mb-0">
              {cmd.keys.map((key, kIdx) => (
                <kbd
                  key={kIdx}
                  className="px-2.5 py-1 bg-white/10 border border-white/30 text-white rounded text-sm font-bold shadow-[0_2px_0_rgba(255,255,255,0.2)] uppercase tracking-wider min-w-[32px] text-center"
                >
                  {key}
                </kbd>
              ))}
            </div>

            {/* Descrição do Comando */}
            <p className="text-gray-400 text-sm sm:text-right max-w-[280px]">
              {cmd.action}
            </p>
          </div>
        ))}
      </div>

      {/* Dica de Sobrevivência */}
      <div className="w-full bg-red-950/20 border border-red-900/30 p-3 text-xs text-red-400/80 leading-relaxed">
        <span className="font-bold text-red-500 uppercase block mb-1">Aviso do Sistema:</span>
        Não corra sem necessidade. O colapso mental se aproxima mais rápido quando você perde o fôlego em zonas instáveis.
      </div>

      {/* Botão Voltar */}
      <button
        onClick={onContinue}
        className="w-full py-3 border border-white/20 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 uppercase font-bold tracking-widest text-sm"
      >
        Prosseguir
      </button>
    </div>
  );
}
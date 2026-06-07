'use client'

export default function CRTFilter() {
    return (
        // z-[9999] garante que fique por cima do Canvas 3D e do Menu.
        // pointer-events-none é crucial para você conseguir clicar no jogo através do filtro!
        <div className="fixed inset-0 z-[9999] pointer-events-none crt-flicker">

            {/* Scanlines horizontais. Você pode diminuir o opacity se atrapalhar muito a visão no jogo */}
            <div className="absolute inset-0 scanlines opacity-50" />

            {/* Bordas escurecidas */}
            <div className="absolute inset-0 vignette" />

        </div>
    )
}
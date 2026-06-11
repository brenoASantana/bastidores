'use client'

export default function CRTFilter() {
    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none crt-flicker">

            <div className="absolute inset-0 scanlines opacity-50" />

            {/* Bordas escurecidas */}
            <div className="absolute inset-0 vignette" />

        </div>
    )
}
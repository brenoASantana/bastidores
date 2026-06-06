'use client'

import type { RefObject } from 'react'

export interface AnxietyBarProps {
  barRef?: RefObject<HTMLDivElement>
  textRef?: RefObject<HTMLDivElement>
  distortionStrengthRef?: RefObject<HTMLDivElement>
}

export function getAnxietyColor(level: number) {
  if (level < 30) return '#00ff00'
  if (level < 60) return '#ffaa00'
  return '#ff0000'
}

export default function AnxietyBar({
  barRef,
  textRef,
  distortionStrengthRef
}: AnxietyBarProps) {

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      <div className="absolute bottom-8 left-8 w-48">
        <div className="text-sm text-white mb-2 font-mono">ANSIEDADE</div>
        <div className="w-full h-4 bg-gray-900 border border-gray-700">
          <div
            ref={barRef}
            className="h-full transition-all"
          />
        </div>
        <div ref={textRef} className="text-xs text-gray-400 mt-1 font-mono" />
      </div>

      {
        <div
          ref={distortionStrengthRef}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0 }}
        />
      }

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  )
}
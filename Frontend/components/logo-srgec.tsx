"use client"

import React from "react"

export function SRGECIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`${className} relative flex items-center justify-center flex-shrink-0 select-none`}>
      <img
        src="/logo-srgec.png"
        alt="Seshadri Rao Gudlavalleru Engineering College Logo"
        className="w-full h-full object-contain rounded-full drop-shadow-sm"
      />
    </div>
  )
}

export function SRGECLogo({
  variant = "full",
  subtitle = true,
}: {
  variant?: "full" | "compact" | "horizontal"
  subtitle?: boolean
}) {
  return (
    <div className="flex items-center gap-3.5 select-none" suppressHydrationWarning>
      {/* Official College Logo Emblem */}
      <SRGECIcon className="w-12 h-12 md:w-14 md:h-14" />

      {/* Institution Typography */}
      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-baseline gap-2">
          <span className="text-xl md:text-2xl font-black tracking-tight text-[#0B2545] font-sans">
            SRGEC
          </span>
          <span className="hidden sm:inline-block text-[11px] font-bold text-[#C5A059] bg-[#0B2545]/5 px-2 py-0.5 rounded border border-[#C5A059]/30">
            EAPCET CODE: GECW
          </span>
        </div>
        <span className="text-xs md:text-sm font-bold text-gray-900 tracking-tight font-sans">
          Seshadri Rao Gudlavalleru Engineering College
        </span>
        {subtitle && (
          <span className="text-[10px] md:text-[11px] font-medium text-gray-500 tracking-normal hidden sm:block">
            Autonomous Institution • Permanently Affiliated to JNTUK • NAAC 'A+' Grade
          </span>
        )}
      </div>
    </div>
  )
}

// Backward compatibility aliases
export const VishnuLogo = SRGECLogo
export const VishnuIcon = SRGECIcon

"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SRGECIcon } from "../logo-srgec"

interface ChatHeaderProps {
  onClose?: () => void
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] bg-white">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-xs border border-gray-150">
          <SRGECIcon className="w-8 h-8" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[#0B2545] font-extrabold text-base leading-tight">Nemo</h1>
            <span className="text-[10px] font-bold text-[#C5A059] bg-[#0B2545]/5 px-2 py-0.5 rounded border border-[#C5A059]/20">
              CODE: GECW
            </span>
          </div>
          <p className="text-[#64748b] text-xs">SRGEC Virtual Admissions Advisor</p>
        </div>
      </div>
      {onClose && (
        <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-slate-100" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
}

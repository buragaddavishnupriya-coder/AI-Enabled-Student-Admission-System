import { MessageCircle, Sparkles } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex flex-col items-center gap-4 max-w-md mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[#0B2545]/10 flex items-center justify-center text-[#0B2545] shadow-xs">
          <Sparkles className="w-8 h-8 text-[#C5A059]" />
        </div>
        <h2 className="text-[#0B2545] text-xl font-bold tracking-tight">
          SRGEC Admissions Assistant
        </h2>
        <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
          Ask any question about Seshadri Rao Gudlavalleru Engineering College admissions, AP EAPCET code <strong>GECW</strong>, branch seats, scholarships, or choose a prompt below.
        </p>
      </div>
    </div>
  )
}

"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Monitor, Radio, Settings, Zap, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"

const PhDDisciplines = [
  {
    name: "Computer Science & Engineering",
    code: "Dept. of CSE",
    focus: "Artificial Intelligence, Deep Learning, Cloud Computing, Big Data Architecture, Distributed Systems",
    icon: Monitor,
  },
  {
    name: "Electronics & Communication Engineering",
    code: "Dept. of ECE",
    focus: "VLSI Architecture, Embedded Sensors, Wireless Telecommunications, RF & Microwave Circuits, Signal Processing",
    icon: Radio,
  },
  {
    name: "Electrical & Electronics Engineering",
    code: "Dept. of EEE",
    focus: "Renewable Power Systems, Smart Grids, Electric Vehicle Drive Trains, High Voltage Engineering",
    icon: Zap,
  },
  {
    name: "Mechanical Engineering",
    code: "Dept. of ME",
    focus: "Additive Manufacturing, Robotics & Automation, Thermal Systems, Composite Materials, CAD/CAM Optimization",
    icon: Settings,
  },
]

export default function PhDProgrammesPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Title Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#0B2545]/10 text-[#0B2545] px-4 py-1.5 rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            JNTUK Recognized Research Centres
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0B2545] tracking-tight">
            Doctor of Philosophy <span className="text-[#C5A059]">(Ph.D)</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Empowering research scholars of Seshadri Rao Gudlavalleru Engineering College to pioneer breakthrough technologies and advance scientific discovery.
          </p>
        </div>

        {/* Disciplines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PhDDisciplines.map((discipline, idx) => (
            <Card
              key={idx}
              className="border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-white rounded-2xl overflow-hidden p-6 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#0B2545]/10 text-[#0B2545] flex items-center justify-center mb-5">
                  <discipline.icon className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider block mb-1">
                  {discipline.code}
                </span>
                <h3 className="text-base font-bold text-gray-900 leading-snug mb-3">
                  {discipline.name}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {discipline.focus}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-150">
                <span className="text-xs font-semibold text-gray-500">
                  Affiliation: JNTUK Kakinada
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Research Support Card */}
        <div className="bg-[#0B2545] text-white rounded-2xl p-8 shadow-md">
          <div className="max-w-3xl">
            <h3 className="text-xl md:text-2xl font-bold mb-2">Research Facilities & Fellowships</h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-6">
              SRGEC provides modern research computing labs, central library e-journal access (IEEE, Springer, Elsevier), seed money grants, and collaborative industry projects to support doctoral researchers.
            </p>
            <Link href="/apply">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E5BA6C] hover:underline">
                Inquire about Ph.D Admissions & Research Vacancies <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B2545] text-white py-10 mt-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Seshadri Rao Gudlavalleru Engineering College (Autonomous). All Rights Reserved.</p>
          <p>Gudlavalleru, Krishna District, Andhra Pradesh, India.</p>
        </div>
      </footer>
    </div>
  )
}

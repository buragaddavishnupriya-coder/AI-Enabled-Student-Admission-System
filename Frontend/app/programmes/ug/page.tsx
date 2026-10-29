"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Milestone, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { SRGEC_CONFIG } from "@/lib/college-config"
import { Button } from "@/components/ui/button"

export default function UGProgrammesPage() {
  const branches = SRGEC_CONFIG.programmes.ug

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#0B2545]/10 text-[#0B2545] px-4 py-1.5 rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            AICTE Approved • Autonomous • NAAC 'A+' Grade
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0B2545] tracking-tight">
            BACHELOR OF TECHNOLOGY <span className="text-[#C5A059]">[B.TECH.]</span>
          </h1>
          <div className="mt-4 flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm md:text-base font-semibold text-gray-700">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0B2545]" />
              COURSE DURATION : <strong className="text-gray-900">FOUR YEARS</strong>
            </span>
            <span className="hidden md:inline text-gray-300">|</span>
            <span className="flex items-center gap-1.5">
              <Milestone className="w-4 h-4 text-[#C5A059]" />
              AP EAPCET COUNSELLING CODE : <strong className="text-[#0B2545] font-black text-lg">GECW</strong>
            </span>
          </div>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {branches.map((branch, idx) => (
            <Card
              key={idx}
              className="border-t-4 border-t-[#0B2545] shadow-sm hover:shadow-lg transition-all duration-200 bg-white rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug">
                    {branch.name}
                  </h3>
                </div>

                <div className="text-xs font-semibold text-gray-500 mb-4 flex items-center gap-2">
                  <span>Branch Code:</span>
                  <span className="text-[#C5A059] font-black text-sm bg-[#0B2545]/5 px-2 py-0.5 rounded">
                    {branch.code}
                  </span>
                </div>

                {branch.description && (
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    {branch.description}
                  </p>
                )}

                <hr className="border-gray-150 my-3" />

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Approved Total Intake:</span>
                    <strong className="text-gray-900">{branch.intake} Seats</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Category 'A' (Convener Quota):</span>
                    <strong className="text-gray-800">{branch.catA} Seats</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Category 'B' (Management):</span>
                    <strong className="text-gray-800">{branch.catB} Seats</strong>
                  </div>
                  <div className="flex justify-between text-gray-600 pt-1 border-t border-gray-100">
                    <span>Standard Tuition Fee:</span>
                    <strong className="text-[#0B2545]">₹{branch.feePerYear.toLocaleString("en-IN")}/year</strong>
                  </div>
                </div>
              </CardContent>

              <div className="p-4 bg-slate-50 border-t border-gray-100 text-center">
                <Link href="/apply">
                  <span className="text-xs font-bold text-[#0B2545] hover:text-[#133E87] flex items-center justify-center gap-1">
                    Apply for this Branch <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Fee Structure banner */}
        <div className="bg-[#0B2545] text-white rounded-2xl p-6 md:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#E5BA6C] uppercase tracking-wider block">
              Government Regulated Tuition Structure
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">
              Fee Structure for B.Tech Programmes
            </h2>
            <p className="text-xs text-slate-300">
              Approved as per AP Higher Education Regulatory & Monitoring Commission guidelines.
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-2xl md:text-3xl font-black text-[#E5BA6C]">
              ₹70,000 – ₹1,03,000 <span className="text-xs font-medium text-slate-300">per annum</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              *100% reimbursed for eligible candidates under Jagananna Vidya Deevena (JVD).
            </p>
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

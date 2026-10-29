"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Award, BookOpen, Building, CheckCircle2, ChevronRight, GraduationCap, MapPin, Users, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { SRGEC_CONFIG } from "@/lib/college-config"
import { SRGECIcon } from "@/components/logo-srgec"

export default function AboutPage() {
  const stats = [
    { label: "Established", value: "1998", sub: "25+ Years of Excellence" },
    { label: "Affiliation", value: "JNTUK", sub: "Permanently Affiliated" },
    { label: "Status", value: "Autonomous", sub: "UGC & AICTE Approved" },
    { label: "NAAC Grade", value: "Grade 'A+'", sub: "Institutional Accreditation" },
    { label: "NBA Status", value: "Accredited", sub: "Core Engineering Branches" },
    { label: "Counselling Code", value: "GECW", sub: "AP State Web Options" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16 flex-1">
        {/* Page Title */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#0B2545] font-bold uppercase tracking-wider bg-[#0B2545]/10 px-3 py-1 rounded-full mb-3">
            Institutional Profile
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0B2545] tracking-tight">
            About Seshadri Rao Gudlavalleru Engineering College
          </h1>
          <div className="w-20 h-1 bg-[#C5A059] mt-4"></div>
        </div>

        {/* Top Section - Founding Society & History */}
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
          <div className="lg:col-span-8 space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2545]">
              A Heritage of Engineering & Academic Excellence
            </h2>

            <p>
              <strong>Seshadri Rao Gudlavalleru Engineering College (SRGEC)</strong> was established in 1998 by the visionary philanthropic leadership of the <strong>AANM & VVRSR Educational Society</strong> (Adusumilli Aswardha Narayana Murthy & Vallurupalli Venkata Rama Seshadri Rao Educational Society). Nestled in the serene Seshadri Rao Knowledge Village in Gudlavalleru, Krishna District, Andhra Pradesh, the college has stood as a bastion of technical brilliance and innovation for over two and a half decades.
            </p>

            <p>
              The institution is an <strong>Autonomous College</strong> approved by AICTE, New Delhi, and permanently affiliated to <strong>Jawaharlal Nehru Technological University Kakinada (JNTUK)</strong>. SRGEC holds prestigious accreditation from <strong>NAAC with 'A+' Grade</strong> and NBA accreditations for its flagship undergraduate engineering programmes.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-4 p-4 rounded-xl bg-white border border-gray-200">
                <CheckCircle2 className="w-6 h-6 text-[#0B2545] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Vision for Innovation</h4>
                  <p className="text-xs text-gray-600 mt-1">Nurturing creative problem-solvers equipped with advanced computing and core engineering capabilities.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-white border border-gray-200">
                <CheckCircle2 className="w-6 h-6 text-[#0B2545] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Ethics & Social Commitment</h4>
                  <p className="text-xs text-gray-600 mt-1">Imparting human values, professional integrity, and research dedication for regional and global development.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Snapshot Card */}
          <div className="lg:col-span-4 bg-[#0B2545] text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-white/15 pb-4 mb-6">
                <SRGECIcon className="w-10 h-10" />
                <div>
                  <h3 className="text-base font-bold text-white">SRGEC at a Glance</h3>
                  <p className="text-xs text-slate-300">Gudlavalleru, AP</p>
                </div>
              </div>

              <ul className="space-y-5 text-sm">
                <li className="flex items-center gap-3">
                  <MapPin className="text-[#E5BA6C] w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="block font-bold">Location</span>
                    <span className="text-xs text-slate-300">Krishna District, Andhra Pradesh</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Building className="text-[#E5BA6C] w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="block font-bold">Campus Area</span>
                    <span className="text-xs text-slate-300">Modern State-of-the-Art Tech Campus</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <GraduationCap className="text-[#E5BA6C] w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="block font-bold">Academic Degrees</span>
                    <span className="text-xs text-slate-300">B.Tech, M.Tech, MBA, and Ph.D</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Users className="text-[#E5BA6C] w-5 h-5 flex-shrink-0" />
                  <div>
                    <span className="block font-bold">Alumni Strength</span>
                    <span className="text-xs text-slate-300">20,000+ Engineers Globally Placed</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
              <Link href="/apply">
                <span className="text-xs font-bold text-[#E5BA6C] hover:underline flex items-center justify-between">
                  <span>Apply for Admission (A.Y. 2026-27)</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Accreditations & Key Metrics */}
        <div className="border-t border-gray-200 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#0B2545]">
              Accreditations & Recognitions
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Our autonomous standing and high academic credentials assure students of industry-recognized excellence.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((s, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-center">
                <span className="text-xs font-semibold text-gray-500 block">{s.label}</span>
                <span className="text-xl font-black text-[#0B2545] block mt-1">{s.value}</span>
                <span className="text-[11px] text-gray-600 block mt-0.5">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B2545] text-white py-12 mt-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Seshadri Rao Gudlavalleru Engineering College (Autonomous). All Rights Reserved.</p>
          <p>Gudlavalleru, Krishna District, Andhra Pradesh, India.</p>
        </div>
      </footer>
    </div>
  )
}

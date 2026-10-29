"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, GraduationCap, Award, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ProgrammesIndexPage() {
  const tiers = [
    {
      title: "Undergraduate (B.Tech)",
      duration: "4 Years",
      code: "EAPCET Code: GECW",
      description: "Explore 9 accredited B.Tech branches: CSE, AI&ML, Data Science, IoT, IT, ECE, EEE, Mechanical, and Civil Engineering.",
      href: "/programmes/ug",
      icon: BookOpen,
      action: "Explore B.Tech Branches",
    },
    {
      title: "Postgraduate (M.Tech & MBA)",
      duration: "2 Years",
      code: "PGECET: GECW1 • ICET: GECW",
      description: "Advanced engineering M.Tech degrees and Master of Business Administration (MBA).",
      href: "/programmes/pg",
      icon: GraduationCap,
      action: "Explore PG & MBA Programmes",
    },
    {
      title: "Doctoral Research (Ph.D)",
      duration: "3-5 Years",
      code: "JNTUK Recognized Centres",
      description: "Pioneering doctoral research across CSE, ECE, EEE, and Mechanical Engineering.",
      href: "/programmes/phd",
      icon: Award,
      action: "Explore Ph.D Disciplines",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-12 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#0B2545] uppercase tracking-wider bg-[#0B2545]/10 px-3 py-1 rounded-full">
            Academics at SRGEC
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0B2545] tracking-tight mt-3">
            Academic Programmes & Disciplines
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-2 max-w-2xl mx-auto">
            Choose from comprehensive undergraduate, postgraduate, and research programmes at Seshadri Rao Gudlavalleru Engineering College.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <Card
              key={idx}
              className="border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-white rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="bg-[#0B2545] p-6 text-white">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#E5BA6C] mb-3">
                    <tier.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-[#E5BA6C] font-bold block">{tier.code}</span>
                  <h3 className="text-lg font-bold text-white mt-1 leading-snug">{tier.title}</h3>
                </div>

                <CardContent className="p-6 space-y-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase">{tier.duration}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{tier.description}</p>
                </CardContent>
              </div>

              <div className="p-6 pt-0 border-t border-gray-100">
                <Link href={tier.href}>
                  <span className="text-xs font-bold text-[#0B2545] hover:text-[#133E87] flex items-center justify-between">
                    <span>{tier.action}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </Card>
          ))}
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

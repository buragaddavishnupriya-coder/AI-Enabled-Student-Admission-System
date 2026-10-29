"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  BookOpen,
  GraduationCap,
  Award,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Users,
  Compass,
  FileText
} from "lucide-react"
import { useState } from "react"
import { Header } from "./header"
import { SRGECIcon } from "./logo-srgec"
import Link from "next/link"
import { SRGEC_CONFIG } from "@/lib/college-config"

interface SRGECLandingPageProps {
  onInquireNow: () => void
}

export function SRGECLandingPage({ onInquireNow }: SRGECLandingPageProps) {
  const [selectedDegree, setSelectedDegree] = useState("")

  const stats = [
    { label: "Approved Intake", value: "1,200+", detail: "Across 9 UG B.Tech Specializations" },
    { label: "EAPCET Counselling", value: "GECW", detail: "Official AP State Web Code" },
    { label: "NAAC Accreditation", value: "Grade A+", detail: "Autonomous Institution, JNTUK" },
    { label: "Placement Track", value: "85%+", detail: "100+ Leading Campus Recruiters" },
  ]

  const programmeCards = [
    {
      title: "Undergraduate (B.Tech)",
      degree: "4-Year Programmes",
      description: "Nine industry-aligned B.Tech disciplines including CSE, AI & ML, Data Science, IoT, IT, ECE, EEE, Mechanical, and Civil Engineering.",
      icon: BookOpen,
      href: "/programmes/ug",
      badge: "EAPCET Code: GECW",
      seats: "1080 Seats",
    },
    {
      title: "Postgraduate (M.Tech)",
      degree: "2-Year Programmes",
      description: "Advanced engineering degrees in Computer Science, VLSI Design & Embedded Systems, and Power Electronics & Drives.",
      icon: GraduationCap,
      href: "/programmes/pg",
      badge: "PGECET / GATE",
      seats: "48 Seats",
    },
    {
      title: "Management Studies (MBA)",
      degree: "2-Year Programme",
      description: "Master of Business Administration with specializations in Finance, Marketing, Human Resource Management, and Analytics.",
      icon: Award,
      href: "/programmes/pg",
      badge: "ICET Code: GECW",
      seats: "60 Seats",
    },
    {
      title: "Doctoral Research (Ph.D)",
      degree: "Recognized Research Centres",
      description: "Cutting-edge research opportunities in CSE, ECE, EEE, and Mechanical Engineering recognized by JNTUK.",
      icon: ShieldCheck,
      href: "/programmes/phd",
      badge: "Full & Part-Time",
      seats: "Research Scholars",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans flex flex-col">
      {/* Top Header */}
      <Header onInquireNow={onInquireNow} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0B2545] via-[#133E87] to-[#0A192F] text-white py-16 md:py-24 overflow-hidden border-b border-[#0B2545]">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#E5BA6C] px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                Admissions Open for Academic Year {SRGEC_CONFIG.academicYear}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                Seshadri Rao Gudlavalleru Engineering College
              </h1>

              <p className="text-lg md:text-xl text-slate-200 font-light max-w-2xl leading-relaxed">
                Empowering future-ready engineers and innovators through autonomous academic excellence,
                state-of-the-art laboratory research, and premier industry placement opportunities in Gudlavalleru, AP.
              </p>

              {/* Counselling Code Highlight Tag */}
              <div className="inline-flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-sm">
                <span className="text-gray-300">AP EAPCET Counselling Code:</span>
                <span className="font-mono font-black text-xl text-[#E5BA6C] tracking-wider">GECW</span>
                <span className="text-xs text-gray-400 font-normal">| College Code: SRGC</span>
              </div>

              {/* Calls to Action */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link href="/apply">
                  <Button
                    size="lg"
                    className="bg-[#C5A059] hover:bg-[#B38F46] text-[#0B2545] font-extrabold text-sm md:text-base px-7 py-6 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
                  >
                    Apply for Admission 2026 →
                  </Button>
                </Link>

                <Button
                  onClick={onInquireNow}
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold text-sm md:text-base px-6 py-6 rounded-xl backdrop-blur-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2 text-[#E5BA6C]" />
                  Admission Enquiry
                </Button>

                <Link href="/status">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-white/10 text-sm font-semibold px-4 py-6"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Check Status
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Hero Highlights Card */}
            <div className="lg:col-span-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div>
                    <h3 className="font-extrabold text-white text-base">Key Admission Snapshot</h3>
                    <p className="text-xs text-slate-300">A.Y. 2026-2027 Portal</p>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#E5BA6C] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Autonomous Curriculum</h4>
                      <p className="text-xs text-slate-300">AICTE Approved & Permanently affiliated to JNTUK</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#E5BA6C] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Full Fee Reimbursement (JVD)</h4>
                      <p className="text-xs text-slate-300">100% tuition coverage for eligible convener candidates</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#E5BA6C] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">AI-Powered Virtual Desk</h4>
                      <p className="text-xs text-slate-300">Instant answers to programme, seat, and cutoff questions</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <Link href="/programmes/ug" className="text-xs font-semibold text-[#E5BA6C] hover:underline flex items-center justify-between">
                    <span>Explore B.Tech Branches</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Bar */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-gray-150">
                <div className="text-2xl md:text-3xl font-black text-[#0B2545]">{item.value}</div>
                <div className="text-xs md:text-sm font-bold text-gray-800 mt-1">{item.label}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How the Admission Portal Helps Students */}
      <section className="py-16 md:py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#133E87] uppercase tracking-wider bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              Intelligent Admission Guidance
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#0B2545] mt-3">
              How the SRGEC Admission System Helps You
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-3">
              Navigating engineering college admissions can be overwhelming. Our portal streamlines every step from counseling codes to seat confirmation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#0B2545]/10 text-[#0B2545] flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1. Guided Programme Selection</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Review verified seat intakes, branch syllabi, and prerequisite eligibility for all 9 B.Tech specializations and postgraduate programmes.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#133E87]/10 text-[#133E87] flex items-center justify-center mb-5">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">2. Transparent Registration Wizard</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Submit your credentials and EAPCET ranks with an intuitive 4-step wizard that includes a review-before-submit confirmation and reference tracking.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#C5A059]/15 text-[#9A7B38] flex items-center justify-center mb-5">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3. Grounded Virtual Assistant</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ask Nemo questions at any time regarding fees, JVD scholarships, required certificates, or request a callback from our admissions advisors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programme Categories Section */}
      <section className="py-16 md:py-20 px-4 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                Academic Offerings
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-[#0B2545] mt-1">
                Explore SRGEC Programmes
              </h2>
              <p className="text-gray-600 text-sm mt-2 max-w-xl">
                Accredited undergraduate, postgraduate, and doctoral disciplines designed to cultivate technological expertise.
              </p>
            </div>

            <Link href="/programmes/ug" className="mt-4 md:mt-0 text-sm font-bold text-[#0B2545] hover:text-[#133E87] flex items-center gap-1">
              View All Undergraduate Branches <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programmeCards.map((prog, idx) => (
              <Card
                key={idx}
                className="border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-white flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="bg-[#0B2545] p-6 text-white group-hover:bg-[#133E87] transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center mb-3 text-[#E5BA6C]">
                      <prog.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#E5BA6C] uppercase tracking-wider block">
                      {prog.badge}
                    </span>
                    <h3 className="text-lg font-bold mt-1 text-white leading-tight">
                      {prog.title}
                    </h3>
                  </div>

                  <CardContent className="p-6 space-y-3">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {prog.degree} • {prog.seats}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {prog.description}
                    </p>
                  </CardContent>
                </div>

                <div className="p-6 pt-0 border-t border-gray-100 mt-auto">
                  <Link href={prog.href}>
                    <Button
                      variant="ghost"
                      className="w-full text-xs font-bold text-[#0B2545] hover:bg-slate-100 hover:text-[#133E87] justify-between px-0"
                    >
                      <span>Explore Curriculum</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Process: Clear Numbered Steps */}
      <section className="py-16 md:py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#0B2545] uppercase tracking-wider bg-slate-200 px-3 py-1 rounded-full">
              Seamless Onboarding
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#0B2545] mt-3">
              Four Steps to Your SRGEC Admission
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-2">
              Follow our verified enrollment procedure for Category-A (Convener) and Category-B (Management) seats.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SRGEC_CONFIG.admissionSteps.map((s) => (
              <div
                key={s.step}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative space-y-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#0B2545] text-[#E5BA6C] font-black text-sm flex items-center justify-center">
                  0{s.step}
                </div>
                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {s.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/apply">
              <Button className="bg-[#0B2545] hover:bg-[#133E87] text-white font-bold text-sm px-8 py-5 rounded-xl shadow-md">
                Begin Step 1: Online Application →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Assistant Banner Entry Point */}
      <section className="py-12 px-4 bg-[#0B2545] text-white">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-[#133E87] to-[#0B2545] rounded-3xl p-8 md:p-12 border border-white/15 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 text-[#E5BA6C] px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Instant Admissions AI
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Have Questions About Cutoffs or Eligibility?
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">
              Meet Nemo, the SRGEC Virtual Admissions Advisor. Nemo answers queries on counseling code (GECW), branch intake, fees, documents, and schedules callback requests with advisors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button
              onClick={onInquireNow}
              size="lg"
              className="bg-[#C5A059] hover:bg-[#B38F46] text-[#0B2545] font-extrabold text-sm px-6 py-6 rounded-xl shadow-lg"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Open Admissions Assistant
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B2545] text-white border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* College Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <SRGECIcon className="w-12 h-12" />
                <div>
                  <h4 className="font-bold text-sm tracking-tight">Seshadri Rao</h4>
                  <p className="text-xs text-slate-300">Gudlavalleru Engineering College</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                An Autonomous Institution approved by AICTE, New Delhi, and permanently affiliated to JNTUK, Kakinada. Accredited by NAAC with 'A+' Grade.
              </p>
              <div className="text-xs font-mono text-[#E5BA6C] bg-white/5 p-2.5 rounded-lg border border-white/10">
                AP EAPCET CODE: <strong>GECW</strong>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#E5BA6C] uppercase tracking-wider">Admissions Links</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><Link href="/apply" className="hover:text-white">Apply for Admission</Link></li>
                <li><Link href="/status" className="hover:text-white">Check Application Status</Link></li>
                <li><Link href="/programmes/ug" className="hover:text-white">Undergraduate B.Tech</Link></li>
                <li><Link href="/programmes/pg" className="hover:text-white">Postgraduate M.Tech & MBA</Link></li>
                <li><Link href="/scholarships" className="hover:text-white">Scholarships & JVD</Link></li>
                <li><Link href="/get-help" className="hover:text-white">Help & FAQs</Link></li>
              </ul>
            </div>

            {/* Official Contact Info */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#E5BA6C] uppercase tracking-wider">Campus Contact</h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <span>Seshadri Rao Knowledge Village, Gudlavalleru, Krishna District, AP - 521356</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <span>+91 8674-273737 / +91 9848779121</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <span>admissions@gecgudlavalleru.ac.in</span>
                </li>
              </ul>
            </div>

            {/* Timings & Verification */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#E5BA6C] uppercase tracking-wider">Admissions Desk Hours</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Monday to Saturday: 9:00 AM – 5:00 PM<br />
                Sundays: Closed (Online inquiries active 24/7 via Nemo Virtual Assistant)
              </p>
              <div className="pt-2">
                <a
                  href="https://gecgudlavalleru.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#E5BA6C] hover:underline"
                >
                  Official Institutional Portal →
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} Seshadri Rao Gudlavalleru Engineering College (Autonomous). All Rights Reserved.</p>
            <p>Gudlavalleru, Krishna District, Andhra Pradesh, India.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Backward compatibility alias
export const VishnuLandingPage = SRGECLandingPage

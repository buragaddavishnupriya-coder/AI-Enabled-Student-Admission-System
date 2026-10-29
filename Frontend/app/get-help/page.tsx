"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Mail, MessageSquare, Phone, ShieldQuestion, UserCheck, MapPin, ChevronDown, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { SRGEC_CONFIG } from "@/lib/college-config"

export default function GetHelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16 flex-1">
        {/* Page Title */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#0B2545] font-bold uppercase tracking-wider bg-[#0B2545]/10 px-3 py-1 rounded-full mb-3">
            SRGEC Support Desk
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0B2545] tracking-tight">
            Admissions Help & Support
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-2 max-w-lg mx-auto">
            Get instant answers regarding counselling code (GECW), branch options, fee reimbursement, and document submission.
          </p>
          <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Support Grid Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* AI Admissions Agent */}
          <Card className="border border-gray-200 hover:shadow-lg transition-all duration-200 bg-white rounded-2xl overflow-hidden flex flex-col justify-between">
            <CardHeader className="bg-[#0B2545]/5 pb-6">
              <div className="w-12 h-12 rounded-xl bg-[#0B2545] flex items-center justify-center text-[#E5BA6C] mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-[#0B2545]">
                Chat with Nemo AI Advisor
              </CardTitle>
              <CardDescription className="text-gray-600 text-xs mt-1">
                Instant interactive assistance regarding B.Tech branch intake, AP EAPCET code GECW, fees, and advisor callbacks.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Link href="/?chat=true">
                <Button className="w-full bg-[#0B2545] hover:bg-[#133E87] text-white py-5 rounded-xl font-bold text-sm shadow-sm">
                  <Sparkles className="w-4 h-4 mr-2 text-[#E5BA6C]" /> Start Live Chat Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admission Registration */}
          <Card className="border border-gray-200 hover:shadow-lg transition-all duration-200 bg-white rounded-2xl overflow-hidden flex flex-col justify-between">
            <CardHeader className="bg-[#133E87]/5 pb-6">
              <div className="w-12 h-12 rounded-xl bg-[#133E87] flex items-center justify-center text-white mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-[#0B2545]">
                Submit Admission Form
              </CardTitle>
              <CardDescription className="text-gray-600 text-xs mt-1">
                Complete the 4-step registration wizard to reserve your branch preference and receive an official reference ID.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Link href="/apply">
                <Button className="w-full bg-[#C5A059] hover:bg-[#B38F46] text-[#0B2545] py-5 rounded-xl font-extrabold text-sm shadow-sm">
                  Apply for Admission →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info Card */}
        <Card className="border border-gray-200 bg-white shadow-md overflow-hidden rounded-2xl mb-12">
          <div className="bg-[#0B2545] py-5 px-6 md:px-8 text-white flex items-center gap-3">
            <ShieldQuestion className="w-6 h-6 text-[#E5BA6C]" />
            <div>
              <h3 className="text-lg font-bold">SRGEC Admissions Office</h3>
              <p className="text-xs text-slate-300">Gudlavalleru, Krishna District, Andhra Pradesh</p>
            </div>
          </div>

          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#0B2545]/10 flex items-center justify-center text-[#0B2545] flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Admissions Hotline</h5>
                    <p className="text-[#0B2545] font-bold text-sm mt-0.5">+91 8674-273737 / +91 9848779121</p>
                    <p className="text-gray-500 text-xs mt-0.5">Monday – Saturday: 9:00 AM – 5:00 PM</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#0B2545]/10 flex items-center justify-center text-[#0B2545] flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Admissions Desk Email</h5>
                    <p className="text-[#0B2545] font-bold text-sm mt-0.5">admissions@gecgudlavalleru.ac.in</p>
                    <p className="text-gray-500 text-xs mt-0.5">Response within 24 working hours.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 border-t md:border-t-0 md:border-l border-gray-150 pt-6 md:pt-0 md:pl-8">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#0B2545]/10 flex items-center justify-center text-[#0B2545] flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Campus Address</h5>
                    <p className="text-gray-700 text-xs mt-0.5 leading-relaxed">
                      Seshadri Rao Knowledge Village, Gudlavalleru, Krishna District, Andhra Pradesh - 521356, India.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-gray-200">
                  <h6 className="font-bold text-gray-900 text-xs">Technical Portal Support</h6>
                  <p className="text-gray-600 text-xs mt-1">
                    For portal login, token renewal, or submission queries:
                  </p>
                  <p className="text-[#0B2545] font-bold text-xs mt-1">
                    support-portal@gecgudlavalleru.ac.in
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Frequently Asked Questions Accordion */}
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold text-[#0B2545] mb-4">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {SRGEC_CONFIG.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left font-bold text-gray-900 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      openFaq === idx ? "rotate-180 text-[#0B2545]" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs md:text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
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

"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { CheckSquare, Info, ShieldCheck, Check, Award, ArrowRight } from "lucide-react"
import Link from "next/link"
import { SRGEC_CONFIG } from "@/lib/college-config"

export default function ScholarshipsPage() {
  const newDocumentsList = [
    "Model Admission Application Form (SRGEC Admissions Portal)",
    "SSC / 10th Standard Marks Memo",
    "Intermediate (10+2) / Diploma Marks Memo",
    "Transfer Certificate (TC) from qualifying institution",
    "Study / Bonafide Certificates for the last SEVEN consecutive years of study",
    "Integrated Community, Nativity & Date of Birth Certificate (from MeeSeva for SC/ST/BC/Minority students)",
    "White Ration Card / Food Security Card",
    "Latest Income Certificate issued by Tahsildar / Revenue Authority",
    "Aadhaar Card Copies (Student, Father & Mother)",
    "Nationalized Bank Pass Book (Student Account)",
    "AP EAPCET / ECET / ICET Allotment Order (Counselling Code: GECW)",
    "Bonafide Certificate from SRGEC Principal",
    "Recent Passport Size Photographs (6 copies)",
  ]

  const renewalDocumentsList = [
    "Scholarship Renewal Application",
    "Previous Year / Semester Marks Memo (Passed / Promoted)",
    "Bank Pass Book Copy with IFSC code",
    "Student Aadhaar Card Copy",
    "Community / Integrated Caste Certificate",
    "Latest Income Certificate / White Ration Card",
    "College Bonafide Certificate duly endorsed by the Principal",
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-12 px-4 md:px-8 max-w-5xl mx-auto w-full">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center space-x-2 bg-[#0B2545]/10 text-[#0B2545] px-4 py-1.5 rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Financial Assistance & Reimbursement</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0B2545] tracking-tight leading-tight">
            SCHOLARSHIPS & FEE CONCESSIONS
          </h1>
          <p className="mt-2 text-xs md:text-sm font-bold text-[#C5A059] tracking-widest uppercase">
            Seshadri Rao Gudlavalleru Engineering College (Counselling Code: GECW)
          </p>
        </div>

        {/* Jagananna Vidya Deevena (JVD) Government Scheme */}
        <Card className="border border-gray-200 shadow-md bg-white rounded-2xl overflow-hidden mb-10">
          <div className="bg-[#0B2545] py-5 px-6 md:px-8 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Info className="w-6 h-6 text-[#E5BA6C]" />
              <div>
                <h2 className="text-lg md:text-xl font-bold tracking-wide">
                  Jagananna Vidya Deevena (JVD) Scheme
                </h2>
                <p className="text-xs text-slate-300">Government of Andhra Pradesh Fee Reimbursement</p>
              </div>
            </div>
            <span className="text-xs bg-[#C5A059] text-[#0B2545] px-3 py-1 rounded-full font-black">
              100% Tuition Waiver
            </span>
          </div>

          <CardContent className="p-6 md:p-8 space-y-4 text-gray-700 leading-relaxed text-sm">
            <p>
              Students admitted into B.Tech, M.Tech, and MBA programmes through AP State Convener Quota (Code: <strong>GECW</strong>) are eligible for complete tuition fee reimbursement under the Government of Andhra Pradesh Jagananna Vidya Deevena scheme:
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0B2545] mt-0.5 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <p>
                  Students belonging to <strong className="text-gray-900">SC / ST categories</strong> whose family annual income is less than <strong className="text-gray-900">₹2.00 Lakhs per annum</strong>.
                </p>
              </div>

              <div className="flex items-start space-x-3 border-t border-gray-100 pt-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[#0B2545] mt-0.5 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <p>
                  Students belonging to <strong className="text-gray-900">BC / EBC-OC / Disabled / Muslim Minority / Kapu</strong> with annual family income less than <strong className="text-gray-900">₹1.00 Lakh per annum</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SRGEC Institutional Merit Waivers */}
        <Card className="border border-gray-200 shadow-md bg-white rounded-2xl overflow-hidden mb-10">
          <div className="bg-[#133E87] py-5 px-6 md:px-8 text-white flex items-center space-x-3">
            <Award className="w-6 h-6 text-[#E5BA6C]" />
            <div>
              <h2 className="text-lg md:text-xl font-bold tracking-wide">
                SRGEC Merit Excellence Concessions
              </h2>
              <p className="text-xs text-slate-200">Management & Institutional Endowments</p>
            </div>
          </div>

          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 text-center">
                <span className="text-2xl font-black text-[#0B2545]">50% Waiver</span>
                <p className="text-xs font-bold text-gray-700 mt-1">AP EAPCET Rank &lt; 5,000</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Top state rankers tuition concession</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 text-center">
                <span className="text-2xl font-black text-[#0B2545]">30% Waiver</span>
                <p className="text-xs font-bold text-gray-700 mt-1">EAPCET Rank 5,001 - 15,000</p>
                <p className="text-[11px] text-gray-500 mt-0.5">High achiever fee concession</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 text-center">
                <span className="text-2xl font-black text-[#0B2545]">15% Waiver</span>
                <p className="text-xs font-bold text-gray-700 mt-1">EAPCET Rank 15,001 - 30,000</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Merit rank concession</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Documents (New Candidates) */}
        <Card className="border border-gray-200 shadow-md bg-white rounded-2xl overflow-hidden mb-10">
          <div className="bg-[#0B2545] py-5 px-6 md:px-8 text-white">
            <h2 className="text-lg md:text-xl font-bold tracking-wide">
              Documents Checklist for Scholarship Applicants
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Submit verified self-attested Xerox copies to the SRGEC Scholarship Cell during admission verification.
            </p>
          </div>

          <CardContent className="p-6 md:p-8">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {newDocumentsList.map((doc, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs md:text-sm text-gray-700">
                  <CheckSquare className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Renewal Procedure */}
        <Card className="border border-gray-200 shadow-md bg-white rounded-2xl overflow-hidden">
          <div className="bg-slate-800 py-5 px-6 md:px-8 text-white">
            <h2 className="text-lg md:text-xl font-bold tracking-wide">
              Annual Scholarship Renewal Procedure
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              For continuing 2nd, 3rd, and 4th year B.Tech students.
            </p>
          </div>

          <CardContent className="p-6 md:p-8">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-gray-700">
              {renewalDocumentsList.map((doc, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <CheckSquare className="w-4 h-4 text-[#0B2545] shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
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

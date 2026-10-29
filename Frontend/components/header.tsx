"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SRGECLogo } from "./logo-srgec"
import Link from "next/link"
import { Menu, X, Shield, Search, FileText } from "lucide-react"

interface HeaderProps {
  onInquireNow?: () => void
}

export function Header({ onInquireNow }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
      {/* Top institution alert banner */}
      <div className="bg-[#0B2545] text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#E5BA6C]">AP EAPCET Counselling Code: GECW</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-250">Gudlavalleru, Krishna District, AP</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-gray-300">
            <span>Admissions Helpline: +91 8674-273737</span>
            <span>admissions@gecgudlavalleru.ac.in</span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="hover:opacity-95 transition-opacity">
          <SRGECLogo />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold text-gray-700">
          <Link href="/" className="hover:text-[#0B2545] transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-[#0B2545] transition-colors">
            About SRGEC
          </Link>
          <Link href="/programmes/ug" className="hover:text-[#0B2545] transition-colors">
            Programmes
          </Link>
          <Link href="/scholarships" className="hover:text-[#0B2545] transition-colors">
            Scholarships
          </Link>
          <Link href="/status" className="hover:text-[#0B2545] text-[#133E87] flex items-center gap-1 transition-colors">
            <FileText className="w-3.5 h-3.5" />
            Check Status
          </Link>
          <Link href="/get-help" className="hover:text-[#0B2545] transition-colors">
            Help & FAQs
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/status">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:text-[#0B2545] hover:border-[#0B2545] text-xs font-semibold"
            >
              Application Status
            </Button>
          </Link>

          <Link href="/counselor/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-[#0B2545] hover:bg-slate-100 text-xs font-semibold"
            >
              Counselor Login
            </Button>
          </Link>

          {onInquireNow && (
            <Button
              onClick={onInquireNow}
              size="sm"
              variant="outline"
              className="border-[#0B2545] text-[#0B2545] hover:bg-[#0B2545] hover:text-white text-xs font-bold"
            >
              Enquire Now
            </Button>
          )}

          <Link href="/apply">
            <Button
              size="sm"
              className="bg-[#0B2545] hover:bg-[#133E87] text-white font-bold text-xs px-4 shadow-sm"
            >
              Apply for Admission →
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/apply">
            <Button size="sm" className="bg-[#0B2545] text-white text-xs px-3 py-1.5 h-8">
              Apply
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-[#0B2545] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2 text-sm font-medium text-gray-700 border-b border-gray-100 pb-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0B2545]"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0B2545]"
            >
              About SRGEC
            </Link>
            <Link
              href="/programmes/ug"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0B2545]"
            >
              Undergraduate (B.Tech)
            </Link>
            <Link
              href="/programmes/pg"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0B2545]"
            >
              Postgraduate (M.Tech & MBA)
            </Link>
            <Link
              href="/scholarships"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0B2545]"
            >
              Scholarships & Fee Concessions
            </Link>
            <Link
              href="/status"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-[#133E87] font-semibold flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              Check Application Status
            </Link>
            <Link
              href="/get-help"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0B2545]"
            >
              Admissions Help & FAQs
            </Link>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {onInquireNow && (
              <Button
                variant="outline"
                onClick={() => {
                  setMobileMenuOpen(false)
                  onInquireNow()
                }}
                className="w-full border-[#0B2545] text-[#0B2545] text-xs font-bold"
              >
                Start Admission Enquiry
              </Button>
            )}
            <Link href="/apply" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-[#0B2545] hover:bg-[#133E87] text-white text-xs font-bold">
                Apply for Admission (A.Y. 2026-2027)
              </Button>
            </Link>
            <Link href="/counselor/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full text-xs text-gray-600">
                Counselor Portal Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

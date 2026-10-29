"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, CheckCircle2, Clock, AlertCircle, FileText, ArrowRight, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { config } from "@/lib/config"

interface EnrollmentStatusData {
  id: string
  fullName: string
  courseName: string
  courseCategory?: string
  courseFee?: number
  discountPercentage?: number
  finalPayableAmount?: number
  enrollmentStatus: string
  approvalStatus: string
  expectedStartDate?: string
  createdDate?: string
}

function StatusContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get("id") || ""

  const [query, setQuery] = useState(initialId)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<EnrollmentStatusData | null>(null)
  const [notFoundMessage, setNotFoundMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSearch = async (searchVal: string) => {
    const trimmed = searchVal.trim()
    if (!trimmed) return

    setIsLoading(true)
    setResult(null)
    setNotFoundMessage(null)
    setErrorMessage(null)

    try {
      const baseUrl = config.formSubmissionApi?.replace(/\/$/, "") || "http://localhost:8080"
      const isPhone = /^\+?[0-9]{8,15}$/.test(trimmed.replace(/[\s-]/g, ""))
      const param = isPhone ? `phone=${encodeURIComponent(trimmed)}` : `id=${encodeURIComponent(trimmed)}`

      const res = await fetch(`${baseUrl}/api/enrollments/status?${param}`)
      const data = await res.json()

      if (res.ok && data.found && data.enrollment) {
        setResult(data.enrollment)
      } else {
        setNotFoundMessage(
          data.message || `No admission record found for "${trimmed}". Please double-check your Registration ID or registered mobile phone number.`
        )
      }
    } catch (err) {
      console.error("[SRGEC Status] Error checking application status:", err)
      setErrorMessage("Could not connect to the admissions database. Please verify the backend mock-server is running on port 8080.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId)
    }
  }, [initialId])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#0B2545] font-bold uppercase tracking-wider bg-[#0B2545]/10 px-3 py-1 rounded-full mb-3">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" /> Official Admissions Verification
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            Check Application Status
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Track your admission enrollment status with your Registration ID or Registered Mobile Number.
          </p>
        </div>

        {/* Search Card */}
        <Card className="border border-gray-200 shadow-md bg-white rounded-2xl overflow-hidden mb-8">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Registration ID (e.g. SRGEC-2026-...) or Mobile Phone"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#0B2545] outline-none"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#0B2545] hover:bg-[#133E87] text-white px-7 py-3 rounded-xl font-bold text-sm shadow-sm"
              >
                {isLoading ? "Checking..." : "Search Status"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Connection Notice</p>
              <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Not Found Alert */}
        {notFoundMessage && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-sm mb-6">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Record Not Found</p>
              <p className="text-xs text-amber-800 mt-0.5">{notFoundMessage}</p>
              <div className="mt-3">
                <Link href="/apply" className="text-xs font-bold text-[#0B2545] hover:underline flex items-center gap-1">
                  Submit a new Application for Admission <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Found Result Card */}
        {result && (
          <Card className="border border-gray-200 shadow-xl bg-white rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="bg-[#0B2545] text-white py-6 px-6 md:px-8 border-b-4 border-[#C5A059]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-[#E5BA6C] uppercase tracking-wider block">
                    Registration Verified
                  </span>
                  <CardTitle className="text-xl md:text-2xl font-black text-white mt-1">
                    {result.fullName}
                  </CardTitle>
                </div>
                <div className="text-right font-mono text-sm bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                  <span className="text-gray-300 text-xs block">Reference ID</span>
                  <span className="font-bold text-[#E5BA6C]">{result.id}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-gray-200">
                {result.approvalStatus === "Approved" ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0" />
                ) : (
                  <Clock className="w-7 h-7 text-amber-600 flex-shrink-0" />
                )}
                <div>
                  <span className="text-xs uppercase font-bold text-gray-500">Admissions Status</span>
                  <div className="text-base font-extrabold text-[#0B2545] flex items-center gap-2">
                    <span>{result.enrollmentStatus || result.approvalStatus}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        result.approvalStatus === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {result.approvalStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-t border-gray-100 pt-4">
                <div>
                  <span className="text-gray-500 block">Programme / Branch</span>
                  <strong className="text-gray-900 text-sm block mt-0.5">{result.courseName}</strong>
                </div>

                <div>
                  <span className="text-gray-500 block">EAPCET Counselling Code</span>
                  <strong className="text-[#C5A059] text-sm block mt-0.5">GECW</strong>
                </div>

                {result.finalPayableAmount !== undefined && (
                  <div>
                    <span className="text-gray-500 block">Annual Tuition Fee Structure</span>
                    <strong className="text-gray-900 text-sm block mt-0.5">
                      ₹{result.finalPayableAmount.toLocaleString("en-IN")}{" "}
                      {result.discountPercentage ? (
                        <span className="text-emerald-600 text-xs font-normal">
                          ({result.discountPercentage}% concession applied)
                        </span>
                      ) : null}
                    </strong>
                  </div>
                )}

                {result.expectedStartDate && (
                  <div>
                    <span className="text-gray-500 block">Expected Start Date</span>
                    <strong className="text-gray-900 text-sm block mt-0.5">{result.expectedStartDate}</strong>
                  </div>
                )}
              </div>

              {/* Action guidance */}
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs text-blue-900 space-y-1">
                <p className="font-bold">Next Steps for Candidate:</p>
                <p>
                  Please ensure you carry your original certificates to the SRGEC Admissions Office at Gudlavalleru or participate in AP state web counselling using code <strong>GECW</strong>. For queries, contact the admissions hotline at <strong>+91 8674-273737</strong>.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default function StatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-gray-600">
          Loading Application Verification...
        </div>
      }
    >
      <StatusContent />
    </Suspense>
  )
}

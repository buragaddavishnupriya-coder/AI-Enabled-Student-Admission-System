"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
  User,
  GraduationCap,
  Award,
  Loader2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  FileCheck2,
  Calendar,
  Printer,
  FileText
} from "lucide-react"
import Link from "next/link"
import { config } from "@/lib/config"
import { SRGEC_CONFIG } from "@/lib/college-config"

export interface ApplicationFormData {
  // Step 1: Personal Info
  fullName: string
  dob: string
  gender: string
  nationality: string
  category: string
  email: string
  phone: string
  parentName: string
  parentPhone: string
  address: string

  // Step 2: Academic Info
  qualifyingExam: string
  entranceExam: string
  rollNumber: string
  rankScore: string
  tenthMarks: string
  twelfthMarks: string

  // Step 3: Branch & Quota Selection
  choiceActive: string
  choiceOption1: string
  choiceOption2: string
  expectedStartDate: string
  scholarshipCategory: string
  dataAuthorization: boolean
}

const initialFormData: ApplicationFormData = {
  fullName: "",
  dob: "",
  gender: "",
  nationality: "Indian",
  category: "",
  email: "",
  phone: "",
  parentName: "",
  parentPhone: "",
  address: "",
  qualifyingExam: "10+2 / Intermediate (MPC)",
  entranceExam: "AP EAPCET",
  rollNumber: "",
  rankScore: "",
  tenthMarks: "",
  twelfthMarks: "",
  choiceActive: "btech",
  choiceOption1: "cse",
  choiceOption2: "cse-aiml",
  expectedStartDate: "2026-08-01",
  scholarshipCategory: "none",
  dataAuthorization: false,
}

const COURSES = SRGEC_CONFIG.programmes.ug

const getCalculatedDiscount = (category: string, rankScore: string, exam: string): number => {
  const cleanRank = rankScore ? rankScore.replace(/[\s,]/g, "") : ""
  const rank = parseInt(cleanRank) || 50000

  if (category === "sports") return 20
  if (category === "ews") return 30
  if (category === "topper") return 50
  if (category === "merit") {
    if (exam === "AP ECET") {
      if (rank <= 200) return 50
      if (rank <= 500) return 30
      if (rank <= 1000) return 15
      return 5
    } else {
      if (rank <= 5000) return 50
      if (rank <= 15000) return 30
      if (rank <= 30000) return 15
      return 5
    }
  }
  return 0
}

export default function ApplyPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [registrationId, setRegistrationId] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
    if (errors[name as keyof ApplicationFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
    setServerError(null)
  }

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof ApplicationFormData, string>> = {}

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
      if (!formData.dob) newErrors.dob = "Date of birth is required"
      if (!formData.gender) newErrors.gender = "Gender is required"
      if (!formData.category) newErrors.category = "Social category is required"
      if (!formData.email.trim()) {
        newErrors.email = "Email address is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email format"
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Mobile phone number is required"
      } else if (!/^\+?[0-9]{10,12}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
        newErrors.phone = "Please enter a valid 10-12 digit mobile number"
      }
      if (!formData.parentName.trim()) newErrors.parentName = "Parent's / Guardian's name is required"
      if (!formData.parentPhone.trim()) newErrors.parentPhone = "Parent's contact number is required"
      if (!formData.address.trim()) newErrors.address = "Permanent residential address is required"
    }

    if (currentStep === 2) {
      if (!formData.rollNumber.trim()) newErrors.rollNumber = "Roll number / Hall ticket is required"
      if (!formData.rankScore.trim()) newErrors.rankScore = "Entrance exam rank / score is required"
      if (!formData.tenthMarks.trim()) newErrors.tenthMarks = "10th grade marks / GPA scale is required"
      if (!formData.twelfthMarks.trim()) newErrors.twelfthMarks = "12th / Diploma percentage or marks is required"
    }

    if (currentStep === 3) {
      if (!formData.choiceOption1) newErrors.choiceOption1 = "Primary branch preference is required"
      if (!formData.choiceOption2) newErrors.choiceOption2 = "Secondary branch preference is required"
      if (formData.choiceOption1 === formData.choiceOption2 && formData.choiceOption1) {
        newErrors.choiceOption2 = "Secondary preference cannot be identical to primary preference"
      }
      if (!formData.expectedStartDate) {
        newErrors.expectedStartDate = "Expected joining date is required"
      }
      if (!formData.dataAuthorization) {
        newErrors.dataAuthorization = "You must authorize the declaration before proceeding"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(3)) {
      setStep(3)
      return
    }

    setIsSubmitting(true)
    setServerError(null)

    try {
      const calculatedDiscount = getCalculatedDiscount(
        formData.scholarshipCategory,
        formData.rankScore,
        formData.entranceExam
      )

      const apiEndpoint = config.formSubmissionApi?.replace(/\/$/, "") || "http://localhost:8080"
      const response = await fetch(`${apiEndpoint}/api/enrollments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          expectedStartDate: formData.expectedStartDate,
          choiceOption1: formData.choiceOption1,
          discountPercentage: calculatedDiscount.toString(),
        }),
      })

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}))
        throw new Error(errJson.error || `Server responded with status ${response.status}`)
      }

      const data = await response.json()
      setRegistrationId(data.id || `SRGEC-2026-A${Math.floor(10000 + Math.random() * 90000)}`)
      setIsSuccess(true)
    } catch (err) {
      console.error("[SRGEC Apply] Backend submission failed:", err)
      setServerError(
        err instanceof Error
          ? `Submission failed: ${err.message}. Please verify the backend mock-server is running on port 8080.`
          : "An unexpected network error occurred while submitting your application. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const primaryBranch = COURSES.find((c) => c.id === formData.choiceOption1) || COURSES[0]
  const secondaryBranch = COURSES.find((c) => c.id === formData.choiceOption2)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12">
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#0B2545] font-bold uppercase tracking-wider bg-[#0B2545]/10 px-3 py-1 rounded-full mb-3">
            AP EAPCET CODE: GECW
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            SRGEC Admission Registration
          </h1>
          <p className="text-gray-500 mt-1.5 text-sm md:text-base font-medium">
            Academic Year {SRGEC_CONFIG.academicYear} • Seshadri Rao Gudlavalleru Engineering College
          </p>
          <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Progress Tracker */}
        {!isSuccess && (
          <div className="mb-10 max-w-2xl mx-auto px-2">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
              {[
                { num: 1, title: "Personal Details" },
                { num: 2, title: "Academic Records" },
                { num: 3, title: "Branch Choice" },
                { num: 4, title: "Review & Submit" },
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold mb-1.5 transition-colors ${
                      step > s.num
                        ? "bg-emerald-600 text-white"
                        : step === s.num
                        ? "bg-[#0B2545] text-white ring-4 ring-[#0B2545]/20"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`hidden sm:inline ${
                      step === s.num ? "text-[#0B2545]" : "text-gray-500"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-[#0B2545] h-full transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Server Error Alert Banner */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Application Submission Failed</p>
              <p className="text-xs text-red-700 mt-1">{serverError}</p>
            </div>
          </div>
        )}

        {/* Confirmation Screen */}
        {isSuccess ? (
          <Card className="border-t-8 border-t-emerald-600 shadow-xl bg-white rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <CardContent className="pt-10 pb-8 text-center px-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-600">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2545]">
                Application Successfully Registered!
              </h2>

              <p className="text-gray-600 mt-2 max-w-lg mx-auto text-sm md:text-base">
                Your admission application has been registered with Seshadri Rao Gudlavalleru Engineering College.
              </p>

              {/* Application Details Ticket */}
              <div className="my-8 bg-slate-50 p-6 rounded-2xl border border-gray-200 max-w-md mx-auto text-left space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-xs uppercase font-bold text-gray-500">Registration Reference ID</span>
                  <span className="font-mono font-black text-base text-[#0B2545]">{registrationId}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block">Applicant Name</span>
                    <span className="font-bold text-gray-900 text-sm">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Mobile Phone</span>
                    <span className="font-bold text-gray-900 text-sm">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Primary Branch</span>
                    <span className="font-bold text-[#0B2545] text-sm">{primaryBranch.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Counselling Code</span>
                    <span className="font-bold text-[#C5A059] text-sm">GECW</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={`/status?id=${registrationId}`}>
                  <Button className="bg-[#0B2545] hover:bg-[#133E87] text-white font-bold text-sm px-6 py-5 rounded-xl">
                    <FileText className="w-4 h-4 mr-2" />
                    Check Application Status
                  </Button>
                </Link>

                <Link href="/">
                  <Button variant="outline" className="border-gray-300 text-gray-700 text-sm px-6 py-5 rounded-xl">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Multi-step Form Wizard */
          <Card className="shadow-lg border border-gray-200 bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                {/* STEP 1: Personal Details */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="border-b border-gray-200 pb-3">
                      <h2 className="text-lg font-bold text-[#0B2545]">Step 1: Personal & Contact Information</h2>
                      <p className="text-xs text-gray-500">Provide basic student identity details as per 10th / SSC records.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Applicant Full Name (As per SSC) *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Seshadri Kamesh Rao"
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.fullName ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none`}
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.dob ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none`}
                        />
                        {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gender *</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.gender ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none bg-white`}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Social Category *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.category ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none bg-white`}
                        >
                          <option value="">Select Category</option>
                          <option value="OC / General">OC / General</option>
                          <option value="EWS">EWS</option>
                          <option value="BC-A">BC-A</option>
                          <option value="BC-B">BC-B</option>
                          <option value="BC-C">BC-C</option>
                          <option value="BC-D">BC-D</option>
                          <option value="BC-E">BC-E</option>
                          <option value="SC">SC</option>
                          <option value="ST">ST</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nationality *</label>
                        <input
                          type="text"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Applicant Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="student@example.com"
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Applicant Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile number"
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Parent / Guardian Name *
                        </label>
                        <input
                          type="text"
                          name="parentName"
                          value={formData.parentName}
                          onChange={handleChange}
                          placeholder="Parent or Guardian name"
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.parentName ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none`}
                        />
                        {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Parent Contact Number *
                        </label>
                        <input
                          type="tel"
                          name="parentPhone"
                          value={formData.parentPhone}
                          onChange={handleChange}
                          placeholder="Parent 10-digit mobile number"
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.parentPhone ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none`}
                        />
                        {errors.parentPhone && <p className="text-red-500 text-xs mt-1">{errors.parentPhone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Permanent Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                        placeholder="House / Street, Mandal, District, State, PIN"
                        className={`w-full px-4 py-2.5 rounded-xl border ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none`}
                      ></textarea>
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                  </div>
                )}

                {/* STEP 2: Academic & Entrance Exam */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="border-b border-gray-200 pb-3">
                      <h2 className="text-lg font-bold text-[#0B2545]">Step 2: Academic Qualifications & Entrance Exam</h2>
                      <p className="text-xs text-gray-500">Enter marks and entrance rank credentials.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Qualifying Examination *</label>
                        <select
                          name="qualifyingExam"
                          value={formData.qualifyingExam}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#0B2545] outline-none bg-white"
                        >
                          <option value="10+2 / Intermediate (MPC)">10+2 / Intermediate (MPC)</option>
                          <option value="CBSE / ICSE (12th Class)">CBSE / ICSE (12th Class)</option>
                          <option value="Polytechnic Diploma (Lateral Entry)">Polytechnic Diploma (Lateral Entry)</option>
                          <option value="B.Tech (for M.Tech PG)">B.Tech (for M.Tech PG)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Entrance Examination *</label>
                        <select
                          name="entranceExam"
                          value={formData.entranceExam}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#0B2545] outline-none bg-white"
                        >
                          <option value="AP EAPCET">AP EAPCET (State Counselling Code: GECW)</option>
                          <option value="AP ECET">AP ECET (Lateral Entry Code: GECW)</option>
                          <option value="JEE Main">JEE Main (Category-B Management)</option>
                          <option value="GATE / AP PGECET">GATE / AP PGECET (M.Tech)</option>
                          <option value="AP ICET">AP ICET (MBA)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Hall Ticket / Roll Number *
                        </label>
                        <input
                          type="text"
                          name="rollNumber"
                          value={formData.rollNumber}
                          onChange={handleChange}
                          placeholder="e.g. 2601234567"
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.rollNumber ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none`}
                        />
                        {errors.rollNumber && <p className="text-red-500 text-xs mt-1">{errors.rollNumber}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Entrance Rank / Percentile *
                        </label>
                        <input
                          type="text"
                          name="rankScore"
                          value={formData.rankScore}
                          onChange={handleChange}
                          placeholder="e.g. 14250"
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.rankScore ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none`}
                        />
                        {errors.rankScore && <p className="text-red-500 text-xs mt-1">{errors.rankScore}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          10th Standard / SSC Marks / GPA *
                        </label>
                        <input
                          type="text"
                          name="tenthMarks"
                          value={formData.tenthMarks}
                          onChange={handleChange}
                          placeholder="e.g. 9.8 GPA or 580/600"
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.tenthMarks ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none`}
                        />
                        {errors.tenthMarks && <p className="text-red-500 text-xs mt-1">{errors.tenthMarks}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          12th / Intermediate MPC Marks / Percentage *
                        </label>
                        <input
                          type="text"
                          name="twelfthMarks"
                          value={formData.twelfthMarks}
                          onChange={handleChange}
                          placeholder="e.g. 92% or 920/1000"
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.twelfthMarks ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none`}
                        />
                        {errors.twelfthMarks && <p className="text-red-500 text-xs mt-1">{errors.twelfthMarks}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Branch Preferences & Declaration */}
                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="border-b border-gray-200 pb-3">
                      <h2 className="text-lg font-bold text-[#0B2545]">Step 3: Branch Preference & Quota Selection</h2>
                      <p className="text-xs text-gray-500">Select your preferred branch of study at SRGEC.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Primary Branch Choice *
                        </label>
                        <select
                          name="choiceOption1"
                          value={formData.choiceOption1}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.choiceOption1 ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none bg-white`}
                        >
                          {COURSES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.code}) - ₹{c.feePerYear.toLocaleString("en-IN")}/yr
                            </option>
                          ))}
                        </select>
                        {errors.choiceOption1 && <p className="text-red-500 text-xs mt-1">{errors.choiceOption1}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Secondary Branch Choice *
                        </label>
                        <select
                          name="choiceOption2"
                          value={formData.choiceOption2}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.choiceOption2 ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none bg-white`}
                        >
                          <option value="">Select Secondary Preference</option>
                          {COURSES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.code})
                            </option>
                          ))}
                        </select>
                        {errors.choiceOption2 && <p className="text-red-500 text-xs mt-1">{errors.choiceOption2}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Expected Academic Start Date *
                        </label>
                        <input
                          type="date"
                          name="expectedStartDate"
                          value={formData.expectedStartDate}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 rounded-xl border ${
                            errors.expectedStartDate ? "border-red-500" : "border-gray-300"
                          } text-sm focus:ring-2 focus:ring-[#0B2545] outline-none`}
                        />
                        {errors.expectedStartDate && (
                          <p className="text-red-500 text-xs mt-1">{errors.expectedStartDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Fee Concession / Scholarship Quota
                        </label>
                        <select
                          name="scholarshipCategory"
                          value={formData.scholarshipCategory}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#0B2545] outline-none bg-white"
                        >
                          <option value="none">General / No Concession</option>
                          <option value="merit">SRGEC Merit Concession (Top EAPCET Rank)</option>
                          <option value="ews">EWS Fee Concession</option>
                          <option value="sports">Sports / Extracurricular Endowment</option>
                        </select>
                      </div>
                    </div>

                    {/* Declaration Checkbox */}
                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="dataAuthorization"
                          checked={formData.dataAuthorization}
                          onChange={handleChange}
                          className="mt-1 w-4 h-4 rounded border-gray-300 text-[#0B2545] focus:ring-[#0B2545]"
                        />
                        <span className="text-xs text-gray-600 leading-relaxed">
                          I hereby declare that all information supplied is authentic and accurately reflects my credentials. I authorize Seshadri Rao Gudlavalleru Engineering College to verify these details and communicate registration notices back via phone and WhatsApp.
                        </span>
                      </label>
                      {errors.dataAuthorization && (
                        <p className="text-red-500 text-xs mt-1">{errors.dataAuthorization}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 4: Review Before Submit */}
                {step === 4 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-[#0B2545]">Step 4: Review Your Application</h2>
                        <p className="text-xs text-gray-500">Please verify all submitted details before final submission.</p>
                      </div>
                      <span className="text-xs font-bold text-[#C5A059] bg-[#0B2545]/5 px-2.5 py-1 rounded">
                        Final Check
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 border border-gray-200 space-y-4 text-xs">
                      <div>
                        <h3 className="font-bold text-[#0B2545] uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div><span className="text-gray-500 block">Name:</span> <strong className="text-gray-900">{formData.fullName}</strong></div>
                          <div><span className="text-gray-500 block">DOB:</span> <strong className="text-gray-900">{formData.dob}</strong></div>
                          <div><span className="text-gray-500 block">Gender:</span> <strong className="text-gray-900">{formData.gender}</strong></div>
                          <div><span className="text-gray-500 block">Category:</span> <strong className="text-gray-900">{formData.category}</strong></div>
                          <div><span className="text-gray-500 block">Email:</span> <strong className="text-gray-900">{formData.email}</strong></div>
                          <div><span className="text-gray-500 block">Mobile:</span> <strong className="text-gray-900">{formData.phone}</strong></div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-[#0B2545] uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">
                          Academic & Entrance Exam
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div><span className="text-gray-500 block">Exam:</span> <strong className="text-gray-900">{formData.entranceExam}</strong></div>
                          <div><span className="text-gray-500 block">Hall Ticket:</span> <strong className="text-gray-900">{formData.rollNumber}</strong></div>
                          <div><span className="text-gray-500 block">Rank / Score:</span> <strong className="text-[#0B2545] font-black">{formData.rankScore}</strong></div>
                          <div><span className="text-gray-500 block">10th Marks:</span> <strong className="text-gray-900">{formData.tenthMarks}</strong></div>
                          <div><span className="text-gray-500 block">12th Marks:</span> <strong className="text-gray-900">{formData.twelfthMarks}</strong></div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-[#0B2545] uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">
                          Branch Preferences
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <span className="text-gray-500 block">Primary Branch:</span>
                            <strong className="text-[#0B2545] text-sm">{primaryBranch.name} ({primaryBranch.code})</strong>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Secondary Branch:</span>
                            <strong className="text-gray-900 text-sm">{secondaryBranch?.name || "None"}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step Navigation Controls */}
                <div className="pt-8 border-t border-gray-200 flex items-center justify-between">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrev}
                      disabled={isSubmitting}
                      className="border-gray-300 text-gray-700 text-sm"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {step < 4 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-[#0B2545] hover:bg-[#133E87] text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm"
                    >
                      Next Step <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#C5A059] hover:bg-[#B38F46] text-[#0B2545] font-extrabold text-sm px-8 py-3 rounded-xl shadow-lg flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <span>Confirm & Submit Application →</span>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

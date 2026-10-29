"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ChevronDown, Loader2, AlertCircle, ShieldCheck } from "lucide-react"

export interface InquiryFormData {
  headquarters: string
  programType: string
  firstName: string
  lastName: string
  email: string
  cellPhone: string
  homePhone: string
  dataAuthorization: boolean
}

interface InquiryFormProps {
  onSubmit: (data: InquiryFormData) => void
  onClose?: () => void
  isSubmitting?: boolean
  submissionError?: string | null
}

export function InquiryForm({
  onSubmit,
  onClose,
  isSubmitting = false,
  submissionError,
}: InquiryFormProps) {
  const [formData, setFormData] = useState<InquiryFormData>({
    headquarters: "gudlavalleru",
    programType: "",
    firstName: "",
    lastName: "",
    email: "",
    cellPhone: "",
    homePhone: "",
    dataAuthorization: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormData, string>>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    if (errors[name as keyof InquiryFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof InquiryFormData, string>> = {}

    if (!formData.headquarters) {
      newErrors.headquarters = "Please select a campus location"
    }
    if (!formData.programType) {
      newErrors.programType = "Please select a programme of interest"
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.cellPhone.trim()) {
      newErrors.cellPhone = "Mobile phone number is required"
    } else if (!/^\+?[0-9]{10,12}$/.test(formData.cellPhone.replace(/[\s-]/g, ""))) {
      newErrors.cellPhone = "Please enter a valid 10-12 digit mobile number"
    }
    if (!formData.dataAuthorization) {
      newErrors.dataAuthorization = "You must authorize the college to process your inquiry"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate() && !isSubmitting) {
      onSubmit(formData)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 flex items-center justify-center font-sans">
      <Card className="w-full max-w-2xl shadow-xl border border-gray-200 bg-white rounded-2xl overflow-hidden">
        <CardHeader className="relative bg-[#0B2545] text-white py-8 px-6 md:px-8 border-b-4 border-[#C5A059]">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#E5BA6C] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" /> Official Admissions Desk (Code: GECW)
          </div>
          <CardTitle className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            ADMISSIONS <span className="text-[#E5BA6C]">ENQUIRY</span>
          </CardTitle>
          <p className="text-slate-300 text-xs md:text-sm mt-1">
            Academic Year 2026-2027 • Seshadri Rao Gudlavalleru Engineering College (SRGEC)
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-slate-300 hover:text-white transition-colors p-1"
              aria-label="Close form"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          {submissionError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Submission Error</p>
                <p className="text-xs text-red-700 mt-0.5">{submissionError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campus Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Campus Location *
              </label>
              <div className="relative">
                <select
                  name="headquarters"
                  value={formData.headquarters}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.headquarters ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-[#0B2545] focus:border-transparent transition-colors bg-white text-gray-900 appearance-none pr-10 text-sm`}
                >
                  <option value="gudlavalleru">Seshadri Rao Knowledge Village, Gudlavalleru Campus</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
              </div>
              {errors.headquarters && (
                <p className="text-red-500 text-xs mt-1">{errors.headquarters}</p>
              )}
            </div>

            {/* Program Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Programme Level of Interest *
              </label>
              <div className="relative">
                <select
                  name="programType"
                  value={formData.programType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.programType ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-[#0B2545] focus:border-transparent transition-colors bg-white text-gray-900 appearance-none pr-10 text-sm`}
                >
                  <option value="">Select a programme level...</option>
                  <option value="B.Tech (Undergraduate)">B.Tech (Undergraduate Engineering - 4 Years)</option>
                  <option value="B.Tech Lateral Entry">B.Tech (Lateral Entry for Diploma Holders - 3 Years)</option>
                  <option value="M.Tech (Postgraduate)">M.Tech (Postgraduate Engineering - 2 Years)</option>
                  <option value="MBA (Management)">Master of Business Administration (MBA - 2 Years)</option>
                  <option value="Ph.D (Doctoral Studies)">Ph.D (Doctor of Philosophy)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
              </div>
              {errors.programType && (
                <p className="text-red-500 text-xs mt-1">{errors.programType}</p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-[#0B2545] focus:border-transparent transition-colors text-sm`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Last Name / Surname *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g. Sharma"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-[#0B2545] focus:border-transparent transition-colors text-sm`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-[#0B2545] focus:border-transparent transition-colors text-sm`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  name="cellPhone"
                  value={formData.cellPhone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.cellPhone ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-[#0B2545] focus:border-transparent transition-colors text-sm`}
                />
                {errors.cellPhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.cellPhone}</p>
                )}
              </div>
            </div>

            {/* Alternative Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Parent / Alternate Phone (Optional)
              </label>
              <input
                type="tel"
                name="homePhone"
                value={formData.homePhone}
                onChange={handleChange}
                placeholder="Parent or guardian contact number"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0B2545] focus:border-transparent transition-colors text-sm"
              />
            </div>

            {/* Authorization Checkbox */}
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
                  I authorize Seshadri Rao Gudlavalleru Engineering College (SRGEC) to verify the information provided and communicate admission notices, counselling instructions (Code: GECW), and updates via SMS, Phone, or WhatsApp.
                </span>
              </label>
              {errors.dataAuthorization && (
                <p className="text-red-500 text-xs mt-1">{errors.dataAuthorization}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-end gap-3">
              {onClose && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="border-gray-300 text-gray-700 text-sm"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0B2545] hover:bg-[#133E87] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Enquiry...</span>
                  </>
                ) : (
                  <span>Submit & Connect with Advisor →</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

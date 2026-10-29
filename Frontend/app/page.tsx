"use client"

import { useState, useEffect, Suspense } from "react"
import { SRGECLandingPage } from "@/components/srgec-landing-page"
import { InquiryForm, type InquiryFormData } from "@/components/inquiry-form"
import { NemoChatInterface, type FormContext } from "@/components/nemo/nemo-chat-interface"
import { submitFormLead } from "@/lib/form-submission"
import { useSearchParams } from "next/navigation"

type AppState = "landing" | "form" | "chat"

function HomeContent() {
  const [currentState, setCurrentState] = useState<AppState>("landing")
  const [formData, setFormData] = useState<InquiryFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const searchParams = useSearchParams()

  useEffect(() => {
    const apply = searchParams.get("apply")
    const chat = searchParams.get("chat")
    if (apply === "true") {
      setCurrentState("form")
    } else if (chat === "true") {
      setCurrentState("chat")
    }
  }, [searchParams])

  const handleInquireNow = () => {
    setCurrentState("form")
  }

  const handleFormSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      const result = await submitFormLead(data)

      if (result.success) {
        console.log("[SRGEC App] Enquiry submitted successfully:", result.data)
        setFormData(data)
        setCurrentState("chat")
      } else {
        setSubmissionError(
          result.message || "Failed to submit enquiry. Please verify your connection and try again."
        )
        console.error("[SRGEC App] Form submission failed:", result.message)
      }
    } catch (error) {
      setSubmissionError("An unexpected error occurred while communicating with the admissions server.")
      console.error("[SRGEC App] Unexpected error during form submission:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReturnToLanding = () => {
    window.history.replaceState({}, document.title, window.location.pathname)
    setCurrentState("landing")
    setFormData(null)
    setSubmissionError(null)
  }

  const getFormContext = (): FormContext | undefined => {
    if (!formData) return undefined

    return {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      cellPhone: formData.cellPhone,
      homePhone: formData.homePhone,
      headquarters: formData.headquarters,
      programType: formData.programType,
    }
  }

  return (
    <>
      {currentState === "landing" && (
        <SRGECLandingPage onInquireNow={handleInquireNow} />
      )}

      {currentState === "form" && (
        <InquiryForm
          onSubmit={handleFormSubmit}
          onClose={handleReturnToLanding}
          isSubmitting={isSubmitting}
          submissionError={submissionError}
        />
      )}

      {currentState === "chat" && (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
          <NemoChatInterface
            onClose={handleReturnToLanding}
            initialContext={getFormContext()}
          />
        </div>
      )}
    </>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-600 font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0B2545] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold">Loading SRGEC Admissions Portal...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}

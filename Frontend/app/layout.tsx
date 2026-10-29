import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "SRGEC AI-Enabled Student Admission System | Seshadri Rao Gudlavalleru Engineering College",
  description:
    "Official AI-Enabled Student Admission Portal for Seshadri Rao Gudlavalleru Engineering College (SRGEC), Gudlavalleru, Krishna District, Andhra Pradesh (AP EAPCET Code: GECW). Explore accredited B.Tech, M.Tech, and MBA programmes, fee structures, JVD scholarships, and chat with Nemo virtual admissions advisor.",
  generator: "SRGEC Portal",
  icons: {
    icon: "/logo-srgec.png",
    shortcut: "/logo-srgec.png",
    apple: "/logo-srgec.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, User, Sparkles, AlertCircle, ShieldCheck } from "lucide-react"
import { config } from "@/lib/config"
import { SRGECIcon } from "@/components/logo-srgec"

export default function CounselorLogin() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const baseUrl = config.formSubmissionApi?.replace(/\/$/, "") || "http://localhost:8080"
      const res = await fetch(`${baseUrl}/api/counselor/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()
      if (res.ok && data.success && data.token) {
        sessionStorage.removeItem("counselor_auth")
        sessionStorage.setItem("counselor_auth", data.token)
        router.push("/counselor/dashboard")
      } else {
        setError(data.error || "Invalid username or password credentials.")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("[AUTH] Login call failed:", err)
      setError("Cannot connect to authorization server. Please make sure the backend mock is running on port 8080.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-gray-200 shadow-xl bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-[#0B2545] text-white py-6 border-b-4 border-[#C5A059] text-center">
            <SRGECIcon className="w-16 h-16 mx-auto mb-3" />
            <div className="flex justify-center items-center gap-1.5 text-xs text-[#E5BA6C] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" /> SRGEC Admissions Portal
            </div>
            <CardTitle className="text-xl md:text-2xl font-black tracking-tight text-white">
              Counselor Secure Login
            </CardTitle>
            <CardDescription className="text-xs text-slate-300 mt-1">
              Restricted access for authorized SRGEC advisors and admissions management.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="counselor"
                    required
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#0B2545] focus:ring-1 focus:ring-[#0B2545] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-[#0B2545] focus:ring-1 focus:ring-[#0B2545] transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0B2545] hover:bg-[#133E87] text-white font-bold py-2.5 rounded-xl text-sm shadow-md transition-all mt-2"
              >
                {isLoading ? "Authenticating Session..." : "Authorize Portal Access →"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-slate-50 border-t border-gray-150 p-4 text-center justify-center text-xs text-gray-500">
            <div>
              <span className="font-semibold text-gray-700">Default Demo Credentials:</span>
              <div className="font-mono text-gray-600 mt-0.5">counselor / counselor@srgec</div>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

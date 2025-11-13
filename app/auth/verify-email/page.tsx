"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token")
        const type = searchParams.get("type")

        if (type === "email") {
          // Email confirmation link clicked
          setStatus("success")
          setMessage("Your email has been verified successfully!")
          
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
        } else {
          setStatus("error")
          setMessage("Invalid verification link")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Failed to verify email")
      }
    }

    verifyEmail()
  }, [searchParams, router, supabase])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              {status === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
              {status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
              {status === "error" && <XCircle className="h-5 w-5 text-destructive" />}
              Email Verification
            </CardTitle>
            <CardDescription>
              {status === "loading" && "Verifying your email..."}
              {status === "success" && "Verification complete"}
              {status === "error" && "Verification failed"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant={status === "error" ? "destructive" : "default"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
            {status === "success" && (
              <Link href="/dashboard" className="mt-4 block">
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
            )}
            {status === "error" && (
              <Link href="/auth/login" className="mt-4 block">
                <Button variant="outline" className="w-full">Back to Login</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}


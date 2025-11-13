"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { validateUsername, sanitizeUsername } from "@/lib/utils/username-validation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleUsernameChange = (value: string) => {
    const sanitized = sanitizeUsername(value)
    setUsername(sanitized)
    
    if (sanitized) {
      const validation = validateUsername(sanitized)
      setUsernameError(validation.error || null)
    } else {
      setUsernameError(null)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    // Validate username
    const validation = validateUsername(username)
    if (!validation.isValid) {
      setError(validation.error || "Invalid username")
      setIsLoading(false)
      return
    }

    const normalizedUsername = validation.normalized!

    try {
      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", normalizedUsername)
        .single()

      if (existingUser) {
        setError("Username is already taken. Please choose another.")
        setIsLoading(false)
        return
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            username: normalizedUsername,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign up</CardTitle>
              <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe"
                      required
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      className={usernameError ? "border-destructive" : username && !usernameError ? "border-green-500" : ""}
                      maxLength={30}
                    />
                    {username && (
                      <p className="text-xs flex items-center gap-1">
                        {usernameError ? (
                          <>
                            <AlertCircle className="h-3 w-3 text-destructive" />
                            <span className="text-destructive">{usernameError}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">Username available!</span>
                          </>
                        )}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Only letters, numbers, underscores, and hyphens allowed
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">Repeat Password</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Sign up"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, User, Lock, Download, Trash2, Edit2, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { validateUsername } from "@/lib/utils/username-validation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface SettingsClientProps {
  user: SupabaseUser
  profile: any
}

export function SettingsClient({ user, profile }: SettingsClientProps) {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [editingUsername, setEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState(profile?.username || "")
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()
  const router = useRouter()

  const handleUsernameChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/\s/g, '')
    setNewUsername(sanitized)
    
    if (sanitized) {
      const validation = validateUsername(sanitized)
      setUsernameError(validation.error || null)
    } else {
      setUsernameError(null)
    }
  }

  const handleUsernameUpdate = async () => {
    setIsLoading(true)
    try {
      const validation = validateUsername(newUsername)
      if (!validation.isValid) {
        toast({
          title: "Invalid Username",
          description: validation.error || "Invalid username",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const normalizedUsername = validation.normalized!

      // Check if username is already taken
      if (normalizedUsername !== profile?.username) {
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", normalizedUsername)
          .single()

        if (existingUser) {
          toast({
            title: "Username Taken",
            description: "This username is already in use. Please choose another.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({ username: normalizedUsername, updated_at: new Date().toISOString() })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Username updated successfully",
      })
      setEditingUsername(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update username",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Password updated successfully",
      })
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      const { data: links } = await supabase.from("links").select("*").eq("user_id", user.id)
      const { data: analytics } = await supabase.from("analytics").select("*").eq("user_id", user.id)

      const exportData = {
        profile,
        links,
        analytics,
        exportedAt: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `linkhub-data-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "Data exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // Delete user data
      await supabase.from("links").delete().eq("user_id", user.id)
      await supabase.from("analytics").delete().eq("user_id", user.id)
      await supabase.from("profiles").delete().eq("id", user.id)

      // Sign out
      await supabase.auth.signOut()

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Account Information</CardTitle>
              </div>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input value={user.email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>
              <div className="grid gap-2">
                <Label>Username</Label>
                {editingUsername ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={newUsername}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        placeholder="your-username"
                        maxLength={30}
                        className={usernameError ? "border-destructive" : newUsername && !usernameError ? "border-green-500" : ""}
                      />
                      <Button
                        onClick={handleUsernameUpdate}
                        disabled={isLoading || !!usernameError || !newUsername}
                        size="sm"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingUsername(false)
                          setNewUsername(profile?.username || "")
                          setUsernameError(null)
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                    {newUsername && (
                      <p className="text-xs flex items-center gap-1">
                        {usernameError ? (
                          <>
                            <AlertCircle className="h-3 w-3 text-destructive" />
                            <span className="text-destructive">{usernameError}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">Username looks good!</span>
                          </>
                        )}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Only letters, numbers, underscores, and hyphens allowed
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <Input value={profile?.username || ""} disabled className="bg-muted" />
                    <Button
                      onClick={() => setEditingUsername(true)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>Change Password</CardTitle>
              </div>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Data Export */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                <CardTitle>Export Data</CardTitle>
              </div>
              <CardDescription>Download all your data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Export your profile, links, and analytics data as a JSON file.
              </p>
              <Button onClick={handleExportData} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </div>
              <CardDescription>Permanently delete your account</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove
                      all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


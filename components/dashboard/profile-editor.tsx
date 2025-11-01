"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Upload } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  username: string
  display_name: string
  bio: string
  avatar_url: string
  profile_image_url: string
  theme: string
}

interface ProfileEditorProps {
  user: User
  profile: Profile | null
}

export function ProfileEditor({ user, profile }: ProfileEditorProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [username, setUsername] = useState(profile?.username || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      )

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setAvatarUrl(data.secure_url)

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          username: username,
          bio: bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label>Profile Picture</Label>
          <div className="flex items-center gap-4">
            {avatarUrl && (
              <img
                src={avatarUrl || "/placeholder.svg"}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              />
            )}
            <div className="flex-1">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </span>
                </Button>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-username"
          />
          <p className="text-xs text-muted-foreground">Your unique profile URL: linktree.com/u/{username}</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="display-name">Display Name</Label>
          <Input
            id="display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your Name"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people about yourself"
            rows={4}
          />
        </div>

        <Button onClick={handleSave} disabled={isLoading || isUploading} className="w-full">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  )
}

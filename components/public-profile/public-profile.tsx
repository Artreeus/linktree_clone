"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { LinkCard } from "./link-card"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Profile {
  id: string
  username: string
  display_name: string
  bio: string
  avatar_url: string
  profile_image_url: string
  theme: string
}

interface Link {
  id: string
  title: string
  url: string
  icon_url: string
  order_index: number
  is_active: boolean
}

interface PublicProfileProps {
  profile: Profile
  links: Link[]
}

export function PublicProfile({ profile, links }: PublicProfileProps) {
  const supabase = createClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Track profile view
    const trackView = async () => {
      try {
        await supabase.from("analytics").insert({
          link_id: null,
          user_id: profile.id,
          referrer: document.referrer,
          user_agent: navigator.userAgent,
        })
      } catch (error) {
        console.error("Failed to track view:", error)
      }
    }
    trackView()
    setIsLoading(false)
  }, [profile.id, supabase])

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            {profile.avatar_url && (
              <img
                src={profile.avatar_url || "/placeholder.svg"}
                alt={profile.display_name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-border mb-4"
              />
            )}
            <h1 className="text-3xl font-bold mb-2">
              {profile.display_name || profile.username}
            </h1>
            {profile.bio && (
              <p className="text-muted-foreground max-w-sm mx-auto">{profile.bio}</p>
            )}
          </div>

          {/* Links */}
          <div className="space-y-3">
            {links.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground">No links available yet</p>
              </div>
            ) : (
              links.map((link) => (
                <LinkCard key={link.id} link={link} userId={profile.id} />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-semibold">LinkHub</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

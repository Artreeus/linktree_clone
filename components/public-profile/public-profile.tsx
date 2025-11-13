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

  const getThemeClasses = () => {
    const theme = profile.theme || "default"
    const themeMap: Record<string, string> = {
      default: "bg-gradient-to-br from-purple-50 via-pink-50 to-background dark:from-purple-950 dark:via-pink-950 dark:to-background",
      ocean: "bg-gradient-to-br from-blue-50 via-cyan-50 to-background dark:from-blue-950 dark:via-cyan-950 dark:to-background",
      sunset: "bg-gradient-to-br from-orange-50 via-red-50 to-background dark:from-orange-950 dark:via-red-950 dark:to-background",
      forest: "bg-gradient-to-br from-green-50 via-emerald-50 to-background dark:from-green-950 dark:via-emerald-950 dark:to-background",
      midnight: "bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900",
      minimal: "bg-background",
    }
    return themeMap[theme] || themeMap.default
  }

  return (
    <div className={`min-h-screen ${getThemeClasses()}`}>
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Profile Header with animations */}
          <div className="text-center mb-8 animate-fade-in">
            {profile.avatar_url && (
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.display_name}
                  className="relative w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary shadow-lg hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {profile.display_name || profile.username}
            </h1>
            {profile.bio && <p className="text-muted-foreground text-lg max-w-xs mx-auto">{profile.bio}</p>}
          </div>

          {/* Links with staggered animations */}
          <div className="space-y-3">
            {links.length === 0 ? (
              <div className="text-center py-8 animate-fade-in">
                <p className="text-muted-foreground">No links available yet</p>
              </div>
            ) : (
              links.map((link, index) => (
                <div
                  key={link.id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <LinkCard link={link} userId={profile.id} />
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-12 animate-fade-in">
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-semibold text-primary">Linktree Clone</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

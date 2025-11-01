"use client"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface Link {
  id: string
  title: string
  url: string
  icon_url: string
  order_index: number
  is_active: boolean
}

interface LinkCardProps {
  link: Link
  userId: string
}

export function LinkCard({ link, userId }: LinkCardProps) {
  const supabase = createClient()

  const handleClick = async () => {
    // Track link click
    try {
      await supabase.from("analytics").insert({
        link_id: link.id,
        user_id: userId,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
      })
    } catch (error) {
      console.error("Failed to track click:", error)
    }

    // Open link
    window.open(link.url, "_blank")
  }

  return (
    <Button
      onClick={handleClick}
      className="w-full h-auto py-4 px-4 flex items-center justify-between bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/80 text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 group"
    >
      <span className="font-medium text-base">{link.title}</span>
      <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
    </Button>
  )
}

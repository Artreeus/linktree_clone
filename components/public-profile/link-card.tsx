"use client"

import { createClient } from "@/lib/supabase/client"
import { ExternalLink, Instagram, Twitter, Linkedin, Github, Youtube, Facebook, Globe, Mail } from "lucide-react"

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

const ICON_MAP: Record<string, any> = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  facebook: Facebook,
  website: Globe,
  email: Mail,
  custom: ExternalLink,
}

export function LinkCard({ link, userId }: LinkCardProps) {
  const supabase = createClient()
  const IconComponent = ICON_MAP[link.icon_url] || ExternalLink

  const handleClick = async () => {
    // Track click
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
    <button
      onClick={handleClick}
      className="w-full group relative overflow-hidden rounded-lg border border-border bg-card hover:bg-accent transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 group-hover:via-primary/10 transition-all duration-500"></div>
      <div className="relative p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <span className="font-medium text-foreground group-hover:text-primary transition-colors">{link.title}</span>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
      </div>
    </button>
  )
}

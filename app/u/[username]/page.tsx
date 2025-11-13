import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PublicProfile } from "@/components/public-profile/public-profile"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{
    username: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).single()

  if (!profile) {
    return {
      title: "Profile Not Found",
    }
  }

  const displayName = profile.display_name || profile.username
  const bio = profile.bio || "Check out my links!"
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  return {
    title: `${displayName} (@${username})`,
    description: bio,
    openGraph: {
      title: `${displayName} (@${username})`,
      description: bio,
      type: "profile",
      username: username,
      images: [
        {
          url: `${baseUrl}/api/og?username=${username}&displayName=${encodeURIComponent(displayName)}&bio=${encodeURIComponent(bio)}`,
          width: 1200,
          height: 630,
          alt: `${displayName}'s profile`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} (@${username})`,
      description: bio,
      images: [`${baseUrl}/api/og?username=${username}&displayName=${encodeURIComponent(displayName)}&bio=${encodeURIComponent(bio)}`],
    },
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).single()

  if (!profile) {
    notFound()
  }

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_active", true)
    .order("order_index", { ascending: true })

  return <PublicProfile profile={profile} links={links || []} />
}

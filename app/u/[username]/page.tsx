import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PublicProfile } from "@/components/public-profile/public-profile"

interface PageProps {
  params: Promise<{
    username: string
  }>
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

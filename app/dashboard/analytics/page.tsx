import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("order_index", { ascending: true })

  // Fetch analytics data
  const { data: analytics } = await supabase
    .from("analytics")
    .select("*, links(title)")
    .eq("user_id", user.id)
    .order("clicked_at", { ascending: false })

  return (
    <AnalyticsDashboard
      user={user}
      profile={profile}
      links={links || []}
      analytics={analytics || []}
    />
  )
}


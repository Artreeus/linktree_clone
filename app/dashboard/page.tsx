import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export default async function DashboardPage() {
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

  return <DashboardClient user={user} profile={profile} initialLinks={links || []} />
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ProfileEditor } from "./profile-editor"
import { EnhancedLinksManager } from "./enhanced-links-manager"
import { QRCodeSection } from "./qr-code-section"
import { PreviewButton } from "./preview-button"
import { AnalyticsTab } from "./analytics-tab"
import { AppearanceEditor } from "./appearance-editor"
import { LogoutButton } from "./logout-button"
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

interface Link {
  id: string
  title: string
  url: string
  icon_url: string
  order_index: number
  is_active: boolean
}

interface DashboardClientProps {
  user: User
  profile: Profile | null
  initialLinks: Link[]
}

export function DashboardClient({ user, profile, initialLinks }: DashboardClientProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/30 dark:to-purple-950/30">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your LinkHub profile and track your success</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <PreviewButton username={profile?.username || ""} />
            <Button variant="outline" asChild className="border-2 hover:border-primary/50 hover:bg-primary/5">
              <Link href="/dashboard/settings">Settings</Link>
            </Button>
            <LogoutButton />
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm border-2 border-border/50 p-1 h-auto">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white py-3 font-medium"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="links"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-blue-600 data-[state=active]:text-white py-3 font-medium"
            >
              Links
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white py-3 font-medium"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="share"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white py-3 font-medium"
            >
              Share
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <ProfileEditor user={user} profile={profile} />
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <EnhancedLinksManager userId={user.id} links={links} setLinks={setLinks} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsTab userId={user.id} links={links} />
          </TabsContent>

          <TabsContent value="share" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <QRCodeSection username={profile?.username || ""} />
              <AppearanceEditor userId={user.id} profile={profile} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

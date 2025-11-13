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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your LinkHub profile</p>
          </div>
          <div className="flex gap-3">
            <PreviewButton username={profile?.username || ""} />
            <Button variant="outline" asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </Button>
            <LogoutButton />
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
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

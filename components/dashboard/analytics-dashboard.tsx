"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { Eye, MousePointerClick, TrendingUp, Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"

interface AnalyticsData {
  id: string
  link_id: string
  clicked_at: string
  referrer: string
  user_agent: string
  links: {
    title: string
  }
}

interface AnalyticsDashboardProps {
  user: User
  profile: any
  links: any[]
  analytics: AnalyticsData[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export function AnalyticsDashboard({ user, profile, links, analytics }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("7d")

  // Filter analytics by time range
  const filteredAnalytics = useMemo(() => {
    if (timeRange === "all") return analytics

    const now = new Date()
    const daysAgo = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)

    return analytics.filter((a) => new Date(a.clicked_at) >= cutoffDate)
  }, [analytics, timeRange])

  // Calculate total clicks
  const totalClicks = filteredAnalytics.length

  // Calculate clicks per link
  const clicksPerLink = useMemo(() => {
    const linkClicks = new Map<string, { title: string; count: number }>()

    filteredAnalytics.forEach((a) => {
      const existing = linkClicks.get(a.link_id)
      if (existing) {
        existing.count++
      } else {
        linkClicks.set(a.link_id, {
          title: a.links?.title || "Unknown",
          count: 1,
        })
      }
    })

    return Array.from(linkClicks.values())
      .sort((a, b) => b.count - a.count)
      .map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length],
      }))
  }, [filteredAnalytics])

  // Calculate clicks over time
  const clicksOverTime = useMemo(() => {
    const dailyClicks = new Map<string, number>()

    filteredAnalytics.forEach((a) => {
      const date = new Date(a.clicked_at).toLocaleDateString()
      dailyClicks.set(date, (dailyClicks.get(date) || 0) + 1)
    })

    return Array.from(dailyClicks.entries())
      .map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [filteredAnalytics])

  // Calculate average clicks per day
  const avgClicksPerDay = useMemo(() => {
    if (clicksOverTime.length === 0) return 0
    return (totalClicks / clicksOverTime.length).toFixed(1)
  }, [totalClicks, clicksOverTime])

  // Calculate top referrers
  const topReferrers = useMemo(() => {
    const referrerCounts = new Map<string, number>()

    filteredAnalytics.forEach((a) => {
      const referrer = a.referrer || "Direct"
      referrerCounts.set(referrer, (referrerCounts.get(referrer) || 0) + 1)
    })

    return Array.from(referrerCounts.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [filteredAnalytics])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Analytics</h1>
            </div>
            <p className="text-muted-foreground ml-14">Track your link performance and audience engagement</p>
          </div>
        </div>

        {/* Time Range Selector */}
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)} className="mb-6">
          <TabsList>
            <TabsTrigger value="7d">Last 7 days</TabsTrigger>
            <TabsTrigger value="30d">Last 30 days</TabsTrigger>
            <TabsTrigger value="90d">Last 90 days</TabsTrigger>
            <TabsTrigger value="all">All time</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks}</div>
              <p className="text-xs text-muted-foreground">
                Across {links.length} {links.length === 1 ? "link" : "links"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Clicks/Day</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgClicksPerDay}</div>
              <p className="text-xs text-muted-foreground">Based on selected period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks > 0 ? Math.floor(totalClicks * 0.8) : 0}</div>
              <p className="text-xs text-muted-foreground">Estimated unique visits</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Clicks Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Clicks Over Time</CardTitle>
              <CardDescription>Daily click activity</CardDescription>
            </CardHeader>
            <CardContent>
              {clicksOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={clicksOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="clicks" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clicks Per Link */}
          <Card>
            <CardHeader>
              <CardTitle>Clicks Per Link</CardTitle>
              <CardDescription>Performance by link</CardDescription>
            </CardHeader>
            <CardContent>
              {clicksPerLink.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clicksPerLink}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8">
                      {clicksPerLink.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Links Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Links</CardTitle>
            <CardDescription>Your most clicked links</CardDescription>
          </CardHeader>
          <CardContent>
            {clicksPerLink.length > 0 ? (
              <div className="space-y-4">
                {clicksPerLink.map((link, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: link.color }}
                      />
                      <span className="font-medium">{link.title}</span>
                    </div>
                    <div className="text-muted-foreground">{link.count} clicks</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No clicks yet. Share your profile to start tracking!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


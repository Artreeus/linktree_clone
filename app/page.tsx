import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowRight, Link2, Share2, BarChart3, User } from "lucide-react"

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold flex items-center gap-2">
            <Link2 className="h-6 w-6" />
            LinkHub
          </div>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Everything you are.
            <br />
            In one, simple link.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Share all your important links in one place. Create a beautiful profile that drives traffic to your website, social media, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/auth/sign-up">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose LinkHub?</h2>
            <p className="text-lg text-muted-foreground">Everything you need to share your links effectively</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Manage All Links</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Add, edit, and organize all your important links in one beautiful profile page.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Easy Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share your profile with a simple link or QR code. Perfect for social media bios and more.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Track Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  See how many people click on each link and get insights into your audience engagement.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <p className="text-4xl font-bold">10K+</p>
            <p className="text-muted-foreground">Active Users</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold">1M+</p>
            <p className="text-muted-foreground">Links Shared</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold">50M+</p>
            <p className="text-muted-foreground">Clicks Tracked</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-6 bg-muted/50 border border-border rounded-lg p-12">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground">
            Create your LinkHub profile today and start sharing your links with the world.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="gap-2">
              Create Your Profile <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 LinkHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

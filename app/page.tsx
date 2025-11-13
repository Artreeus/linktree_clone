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
      <section className="container mx-auto px-4 py-24 md:py-32 relative">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm">
            <Star className="h-4 w-4 text-purple-600 dark:text-purple-400 fill-current" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Trusted by 10,000+ creators worldwide
            </span>
          </div>

          {/* Main Heading */}
          <div className="animate-fade-in space-y-4">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-balance leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                One Link.
              </span>
              <br />
              <span className="text-foreground">Infinite Possibilities.</span>
            </h1>
          </div>

          {/* Subheading */}
          <div className="animate-fade-in-delay-1">
            <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed">
              The ultimate link-in-bio platform. Share your content, grow your audience, and track your success—all from one beautiful page.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in-delay-2">
            <Link href="/auth/sign-up">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/60 hover:scale-105 transition-all duration-300">
                Start For Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 bg-background/50 backdrop-blur-sm border-2 hover:bg-primary/5 hover:border-primary/50 hover:scale-105 transition-all duration-300">
                <Sparkles className="h-5 w-5" />
                See Features
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground animate-fade-in-delay-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <span>Setup in 2 minutes</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <span>Free forever</span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 hidden lg:block animate-float">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 blur-xl" />
        </div>
        <div className="absolute bottom-20 right-10 hidden lg:block animate-float animation-delay-2000">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-20 blur-xl" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you share, grow, and monetize your online presence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 border-border/50 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer group bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                  <Link2 className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">Smart Link Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Drag-and-drop reordering, scheduling, and social media icons. Manage unlimited links with ease.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer group bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                  <BarChart3 className="h-7 w-7 text-pink-600 dark:text-pink-400" />
                </div>
                <CardTitle className="text-xl">Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Track clicks, views, and engagement with beautiful charts. Know what works best.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer group bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                  <Palette className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">Custom Themes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Choose from 6 beautiful themes and customize colors, fonts, and button styles to match your brand.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer group bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                  <Share2 className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">QR Code & Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Generate QR codes instantly. Share your profile anywhere—social media, business cards, or email.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer group bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                  <TrendingUp className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl">SEO Optimized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Built-in SEO with Open Graph images. Get discovered and rank higher in search results.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer group bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                  <Code className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-xl">Developer Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Built with Next.js 16, React 19, and TypeScript. Lightning-fast performance guaranteed.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-3 p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="flex items-center justify-center">
              <div className="relative">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-lg opacity-50" />
              </div>
            </div>
            <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">10K+</p>
            <p className="text-muted-foreground font-medium">Active Creators</p>
          </div>
          <div className="text-center space-y-3 p-8 rounded-2xl bg-gradient-to-br from-pink-500/10 to-blue-500/10 border border-pink-500/20 backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="flex items-center justify-center">
              <div className="relative">
                <Zap className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                <div className="absolute inset-0 bg-pink-500 rounded-full blur-lg opacity-50" />
              </div>
            </div>
            <p className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">1M+</p>
            <p className="text-muted-foreground font-medium">Links Created</p>
          </div>
          <div className="text-center space-y-3 p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="flex items-center justify-center">
              <div className="relative">
                <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-50" />
              </div>
            </div>
            <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">50M+</p>
            <p className="text-muted-foreground font-medium">Total Clicks</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl blur-3xl -z-10" />
          
          <div className="relative bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-xl border-2 border-primary/20 rounded-3xl p-12 md:p-16 shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <div className="space-y-6 mt-6">
              <h2 className="text-4xl md:text-5xl font-bold">Ready to shine online?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of creators, influencers, and businesses using LinkHub to share their content and grow their audience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/auth/sign-up">
                  <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/60 hover:scale-105 transition-all duration-300">
                    Start Free Now <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-2 hover:bg-primary/5">
                    Sign In
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground pt-4">
                ✨ No credit card required • 🚀 Setup in minutes • 💎 Free forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LinkHub
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 LinkHub. Made with ❤️ for creators.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

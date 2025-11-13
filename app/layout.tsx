import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'LinkHub - Share Your Links in One Place',
  description: 'Create a beautiful profile page to share all your important links. Track analytics, customize your appearance, and manage your online presence.',
  keywords: ['linktree', 'bio link', 'link in bio', 'social media', 'profile links'],
  authors: [{ name: 'LinkHub' }],
  openGraph: {
    title: 'LinkHub - Share Your Links in One Place',
    description: 'Create a beautiful profile page to share all your important links.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkHub - Share Your Links in One Place',
    description: 'Create a beautiful profile page to share all your important links.',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}

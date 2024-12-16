import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { ThemeProvider } from './components/theme-switch'
import { metaData } from './config'
import DesktopNav from './components/desktopNav'
import MobileNav from './components/mobileNav'

export const metadata: Metadata = {
  metadataBase: new URL(metaData.baseUrl),
  title: {
    default: metaData.title,
    template: `%s | ${metaData.title}`,
  },
  description: metaData.description,
  openGraph: {
    images: metaData.ogImage,
    title: metaData.title,
    description: metaData.description,
    url: metaData.baseUrl,
    siteName: metaData.name,
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: metaData.name,
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

const cx = (...classes: string[]) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cx(GeistSans.variable, GeistMono.variable)}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          href="/rss.xml"
          title="RSS Feed"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          href="/atom.xml"
          title="Atom Feed"
        />
        <link
          rel="alternate"
          type="application/feed+json"
          href="/feed.json"
          title="JSON Feed"
        />
      </head>
      <body className="antialiased flex flex-col w-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="w-full flex justify-center">
            <div className="w-full max-w-7xl px-8 py-5 flex items-center justify-between">
              <a
                href="/"
                className="text-xl font-serif tracking-wide hover:opacity-80 transition-opacity lowercase"
              >
                {metaData.title}
              </a>
              {/* Desktop Navigation */}
              <DesktopNav />
              {/* Mobile Navigation */}
              <MobileNav />
            </div>
          </header>

          <main className="flex-auto w-full flex flex-col items-center mt-2 md:mt-6 mb-2 lg:mb-40">
            <div className="w-full max-w-7xl px-8">{children}</div>
          </main>

          <footer className="w-full flex justify-center px-8">
            <div className="max-w-7xl w-full">
              <Footer />
            </div>
          </footer>

          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}

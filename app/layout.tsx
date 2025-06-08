import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { Geist as FontHeading } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontHeading = FontHeading({
  subsets: ['latin'],
  variable: '--font-heading',
})

export const metadata: Metadata = {
  title: 'Deutsch123 - Immersive German Language Learning',
  description: 'Learn German through immersive experiences, AI-powered conversations, and authentic cultural content.',
  keywords: [
    'German language learning',
    'language immersion',
    'German culture',
    'online language course',
    'German vocabulary',
    'German grammar',
    'German speaking practice',
    'German pronunciation',
  ],
  authors: [{ name: 'Deutsch123 Team' }],
  creator: 'Deutsch123',
  publisher: 'Deutsch123',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://deutsch123.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://deutsch123.com',
    title: 'Deutsch123 - Immersive German Language Learning',
    description: 'Learn German through immersive experiences, AI-powered conversations, and authentic cultural content.',
    siteName: 'Deutsch123',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deutsch123 - Immersive German Language Learning',
    description: 'Learn German through immersive experiences, AI-powered conversations, and authentic cultural content.',
    creator: '@deutsch123',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontHeading.variable
        )}
      >
        {children}
      </body>
    </html>
  )
} 
import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppProvider } from "@/contexts/app-context";
import { AudioGate } from "@/components/common/audio-gate";
import './globals.css'

const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'رحلة الوعي الصوتي | ألعاب تعليمية للأطفال',
  description: 'منصة تعليمية تفاعلية لتعليم الأطفال مهارات الوعي الصوتي والحروف العربية من خلال ألعاب ممتعة ومشوقة',
  keywords: ['تعليم', 'أطفال', 'لغة عربية', 'وعي صوتي', 'حروف', 'ألعاب تعليمية'],
  authors: [{ name: 'رحلة الوعي الصوتي' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#7C5CFF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="bg-background">
      <body className={`${cairo.className} font-sans antialiased min-h-screen`}>
        <AppProvider>
          {children}
          <AudioGate />
        </AppProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { AppProvider } from "@/contexts/app-context";
import { AudioGate } from "@/components/common/audio-gate";
import './globals.css'

export const metadata: Metadata = {
  title: 'رحلة الوعي الصوتي | ألعاب تعليمية للأطفال',
  description: 'منصة تعليمية تفاعلية لتعليم الأطفال مهارات الوعي الصوتي والحروف العربية من خلال ألعاب ممتعة ومشوقة',
  keywords: ['تعليم', 'أطفال', 'لغة عربية', 'وعي صوتي', 'حروف', 'ألعاب تعليمية'],
  authors: [{ name: 'رحلة الوعي الصوتي' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#7C5CFF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="bg-background">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
      </head>
      <body className="font-sans antialiased min-h-screen" style={{ fontFamily: 'Cairo, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Tahoma, Arial, sans-serif' }}>
        <AppProvider>
          {children}
          <AudioGate />
        </AppProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

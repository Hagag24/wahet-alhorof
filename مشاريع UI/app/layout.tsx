import type { Metadata } from 'next'
import { Cairo, Noto_Kufi_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cairo = Cairo({ subsets: ['arabic'] })
const notoKufArabic = Noto_Kufi_Arabic({ subsets: ['arabic'] })

export const metadata: Metadata = {
  title: 'منصة الألعاب التعليمية - تعليم الأطفال العربية',
  description: 'منصة تعليمية عربية تفاعلية للأطفال من سن 4 إلى 10 سنوات',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="bg-background">
      <body className="font-sans antialiased" style={{ fontFamily: cairo.style.fontFamily }}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

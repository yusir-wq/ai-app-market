import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI应用广场 - 大模型聚合平台',
  description: '聚合聊天、图片、视频等多种AI大模型的应用广场平台',
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
    <html lang="zh-CN" className="bg-background">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

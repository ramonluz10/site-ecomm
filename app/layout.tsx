import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  title: {
    default: 'PragmaticTech - Tecnologia Premium',
    template: '%s | PragmaticTech'
  },
  description: 'Sua loja de tecnologia premium. Os melhores smartphones, notebooks e acessórios com garantia estendida e suporte especializado.',
  keywords: ['tecnologia', 'smartphones', 'notebooks', 'acessórios', 'eletrônicos', 'apple', 'samsung', 'e-commerce'],
  authors: [{ name: 'PragmaticTech' }],
  creator: 'PragmaticTech',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://pragmatictech.com',
    siteName: 'PragmaticTech',
    title: 'PragmaticTech - Tecnologia Premium',
    description: 'Sua loja de tecnologia premium. Os melhores smartphones, notebooks e acessórios.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PragmaticTech - Tecnologia Premium',
    description: 'Sua loja de tecnologia premium.',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0a0a0f' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark bg-background">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

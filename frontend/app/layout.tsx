import './globals.css'

export const metadata = {
  title: 'Site Principal',
  description: 'Site público do e-commerce corporativo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

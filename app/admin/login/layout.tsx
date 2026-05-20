import type { ReactNode } from 'react'

export const metadata = {
  title: 'Login - ERP Administrativo',
  description: 'Acesso ao painel administrativo',
}

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}


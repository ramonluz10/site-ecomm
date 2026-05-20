import type { ReactNode } from 'react'

export const metadata = {
  title: 'Administração - ERP',
  description: 'Painel administrativo do sistema de gestão empresarial',
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

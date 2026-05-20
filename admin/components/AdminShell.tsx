import Link from 'next/link'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/users', label: 'Usuários' },
  { href: '/sales', label: 'Vendas' },
  { href: '/suppliers', label: 'Fornecedores' },
  { href: '/finance', label: 'Financeiro' },
  { href: '/logs', label: 'Logs' },
  { href: '/permissions', label: 'Permissões' },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand">Admin Corporativo</div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="admin-content">{children}</section>
    </div>
  )
}

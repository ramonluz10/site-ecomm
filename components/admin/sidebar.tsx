import Link from 'next/link'
import { getUserFromCookies } from '@/lib/server/get-user'
import { LayoutDashboard, Truck, Box, ShoppingCart, FileText, LogOut } from 'lucide-react'
import { isRoleAllowedForPage, type AdminPagePermission } from '@/lib/server/permissions'

const adminLinks: Array<{ href: string; label: string; icon: typeof LayoutDashboard; page: AdminPagePermission }> = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
  { href: '/admin/produtos', label: 'Produtos', icon: Box, page: 'produtos' },
  { href: '/admin/fornecedores', label: 'Fornecedores', icon: Truck, page: 'fornecedores' },
  { href: '/admin/estoque', label: 'Estoque', icon: ShoppingCart, page: 'estoque' },
  { href: '/admin/vendas', label: 'Vendas', icon: ShoppingCart, page: 'vendas' },
  { href: '/admin/relatorios', label: 'Relatórios', icon: FileText, page: 'relatorios' },
]

export async function AdminSidebar() {
  const user = await getUserFromCookies()
  const links = adminLinks.filter((link) => isRoleAllowedForPage(user?.role, link.page))

  return (
    <aside className="w-72 min-h-screen border-r border-slate-200 bg-white px-4 py-8">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">ERP Admin</p>
          <h1 className="text-lg font-semibold text-slate-900">Gestão Empresarial</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-12 border-t border-slate-200 pt-6">
        <a
          href="/api/admin/auth/logout"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </a>
      </div>
    </aside>
  )
}

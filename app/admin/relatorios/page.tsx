import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardMetrics, getInventoryMovements, getSales } from '@/lib/server/erp-db'
import { AdminSidebar } from '@/components/admin/sidebar'
import { authorizePage } from '@/lib/server/authorize'

export default async function AdminReportsPage() {
  await authorizePage('relatorios')

  const [metrics, sales, movements] = await Promise.all([
    getDashboardMetrics(),
    getSales(),
    getInventoryMovements(),
  ])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8">
          <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Relatórios de Receita</CardTitle>
            <CardDescription>Resumo de receita acumulada.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">R$ {metrics.totalRevenue.toFixed(2)}</p>
            <p className="mt-3 text-sm text-slate-500">Total gerado por vendas.</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Movimentações</CardTitle>
            <CardDescription>Entradas e saídas contabilizadas.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{movements.length}</p>
            <p className="mt-3 text-sm text-slate-500">Movimentações no estoque.</p>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Pedidos</CardTitle>
            <CardDescription>Vendas concluídas no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900">{sales.length}</p>
            <p className="mt-3 text-sm text-slate-500">Pedidos registrados.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Análises rápidas</CardTitle>
          <CardDescription>Resumo detalhado para tomada de decisão.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Estoque disponível</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{metrics.stockAvailable}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Entradas</p>
            <p className="mt-3 text-3xl font-semibold text-emerald-700">{metrics.entries}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Saídas</p>
            <p className="mt-3 text-3xl font-semibold text-rose-700">{metrics.exits}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Fornecedores</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{metrics.totalSuppliers}</p>
          </div>
        </CardContent>
      </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

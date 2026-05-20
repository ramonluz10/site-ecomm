import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardMetrics } from '@/lib/server/erp-db'
import { DashboardCharts } from '@/components/admin/dashboard-charts'
import { AdminSidebar } from '@/components/admin/sidebar'
import { authorizePage } from '@/lib/server/authorize'

export default async function AdminDashboardPage() {
  await authorizePage('dashboard')

  const metrics = await getDashboardMetrics()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8">
          <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-4">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Total de Fornecedores</CardTitle>
            <CardDescription>Fornecedores cadastrados no sistema.</CardDescription>
          </CardHeader>
          <CardContent className="text-4xl font-semibold text-slate-900">{metrics.totalSuppliers}</CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Produtos no Estoque</CardTitle>
            <CardDescription>Itens diferentes disponíveis para venda.</CardDescription>
          </CardHeader>
          <CardContent className="text-4xl font-semibold text-slate-900">{metrics.totalProducts}</CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Quantidade em Estoque</CardTitle>
            <CardDescription>Unidades disponíveis em estoque.</CardDescription>
          </CardHeader>
          <CardContent className="text-4xl font-semibold text-slate-900">{metrics.stockAvailable}</CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Receita Total</CardTitle>
            <CardDescription>Valor total de vendas já registradas.</CardDescription>
          </CardHeader>
          <CardContent className="text-4xl font-semibold text-slate-900">R$ {metrics.totalRevenue.toFixed(2)}</CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Movimentações de Estoque</CardTitle>
            <CardDescription>Entradas e saídas registradas no período.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Entradas</p>
              <p className="mt-3 text-3xl font-semibold text-emerald-700">{metrics.entries}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Saídas</p>
              <p className="mt-3 text-3xl font-semibold text-rose-700">{metrics.exits}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Vendas Finalizadas</CardTitle>
            <CardDescription>Pedidos processados e faturados.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Total de vendas</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{metrics.totalSales}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Margem de estoque</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{metrics.stockAvailable - metrics.exits}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <DashboardCharts metrics={metrics} />
          </div>
        </main>
      </div>
    </div>
  )
}

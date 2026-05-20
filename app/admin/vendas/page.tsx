import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getProducts, getSales } from '@/lib/server/erp-db'
import { SaleForm } from '@/components/admin/sale-form'
import { AdminSidebar } from '@/components/admin/sidebar'
import { authorizePage } from '@/lib/server/authorize'

export default async function AdminSalesPage() {
  await authorizePage('vendas')

  const [products, sales] = await Promise.all([getProducts(), getSales()])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8">
          <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Registrar Venda</CardTitle>
            <CardDescription>Registre vendas diretamente ligadas ao estoque.</CardDescription>
          </CardHeader>
          <CardContent>
            <SaleForm products={products} />
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Resumo de Vendas</CardTitle>
            <CardDescription>Vendas realizadas e receita do sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Vendas registradas</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{sales.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
          <CardDescription>Pedidos finalizados no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.code}</TableCell>
                  <TableCell>{sale.customer_name}</TableCell>
                  <TableCell>{sale.items.length}</TableCell>
                  <TableCell>R$ {sale.total.toFixed(2)}</TableCell>
                  <TableCell>{new Date(sale.created_at).toLocaleDateString('pt-BR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

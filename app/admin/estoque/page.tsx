import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getInventoryMovements, getProducts } from '@/lib/server/erp-db'
import { InventoryForm } from '@/components/admin/inventory-form'
import { AdminSidebar } from '@/components/admin/sidebar'
import { authorizePage } from '@/lib/server/authorize'

export default async function AdminStockPage() {
  await authorizePage('estoque')

  const [products, movements] = await Promise.all([getProducts(), getInventoryMovements()])
  const entradaCount = movements.filter((movement) => movement.type === 'entrada').length
  const saidaCount = movements.filter((movement) => movement.type === 'saida').length
  const lowStockProducts = products.filter((product) => product.stock_quantity <= 10)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8">
          <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Movimentações de Estoque</CardTitle>
            <CardDescription>Registre entradas e saídas vinculadas aos produtos.</CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryForm products={products} />
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Visão Rápida</CardTitle>
              <CardDescription>Resumo com os principais indicadores do estoque.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Produtos cadastrados</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{products.length}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Movimentações totais</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{movements.length}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Entradas</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{entradaCount}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Saídas</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{saidaCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Produtos críticos</CardTitle>
              <CardDescription>Itens com baixo estoque que precisam de atenção.</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">{lowStockProducts.length} produto(s) abaixo do estoque mínimo.</p>
                  <ul className="space-y-2">
                    {lowStockProducts.map((product) => (
                      <li key={product.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-500">SKU {product.sku} · {product.stock_quantity} em estoque</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Nenhum produto abaixo do estoque mínimo.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Produtos no Estoque</CardTitle>
          <CardDescription>Veja o estoque atual por produto.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
                  <TableCell>{product.stock_quantity <= 10 ? 'Crítico' : 'Normal'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
          <CardDescription>Entradas e saídas que afetam o estoque.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.type === 'entrada' ? 'Entrada' : 'Saída'}</TableCell>
                  <TableCell>{products.find((product) => product.id === movement.product_id)?.name ?? 'Produto não encontrado'}</TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.supplier_id ?? '—'}</TableCell>
                  <TableCell>{new Date(movement.created_at).toLocaleDateString('pt-BR')}</TableCell>
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

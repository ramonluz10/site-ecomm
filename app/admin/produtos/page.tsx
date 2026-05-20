import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader as THead, TableRow } from '@/components/ui/table'
import { getProducts } from '@/lib/server/erp-db'
import { ProductForm } from '@/components/admin/product-form'
import { AdminSidebar } from '@/components/admin/sidebar'
import { authorizePage } from '@/lib/server/authorize'

export default async function AdminProductsPage() {
  await authorizePage('produtos')

  const products = await getProducts()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8">
          <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Cadastro de Produtos</CardTitle>
            <CardDescription>Registre produtos e controle o estoque com facilidade.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm />
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Visão de Estoque</CardTitle>
            <CardDescription>Produtos ativos e quantidades disponíveis.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Produtos cadastrados</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{products.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Catálogo de Produtos</CardTitle>
          <CardDescription>Todos os itens registrados no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
              </TableRow>
            </THead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
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

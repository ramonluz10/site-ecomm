"use client"

import { useState } from "react"
import { useCartStore } from "@/lib/stores/cart-store"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, clearCart, getItemCount, getTotal } = useCartStore()
  const [customerName, setCustomerName] = useState('Cliente')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null)
  const [checkoutStatus, setCheckoutStatus] = useState<'success' | 'error' | null>(null)

  const itemCount = getItemCount()
  const total = getTotal()

  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsSubmitting(true)
    setCheckoutMessage(null)
    setCheckoutStatus(null)

    const payload = {
      customer_name: customerName.trim() || 'Cliente',
      items: items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        setCheckoutStatus('error')
        setCheckoutMessage(data?.error || 'Ocorreu um erro ao registrar a venda.')
        return
      }

      clearCart()
      setCheckoutStatus('success')
      setCheckoutMessage('Compra finalizada com sucesso. Venda registrada para o painel administrativo.')
    } catch (error) {
      setCheckoutStatus('error')
      setCheckoutMessage('Ocorreu um erro ao processar o pagamento. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/catalogo" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
            {itemCount > 0 && (
              <span className="text-muted-foreground">({itemCount} {itemCount === 1 ? "item" : "itens"})</span>
            )}
          </div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2>
              <p className="text-muted-foreground mb-6">
                Adicione produtos ao carrinho para continuar comprando
              </p>
              <Link href="/catalogo">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Explorar Produtos
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Lista de itens */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-card border border-border rounded-xl p-4 flex gap-4"
                    >
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ShoppingBag className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/produto/${item.product.slug}`}
                          className="font-semibold hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.product.short_description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= (item.product.stock_quantity || 99)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">
                              {formatPrice(Number(item.product.price) * item.quantity)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-muted-foreground">
                                {formatPrice(Number(item.product.price))} cada
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="flex justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="text-muted-foreground hover:text-destructive hover:border-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Carrinho
                  </Button>
                </div>
              </div>

              {/* Resumo */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({itemCount} itens)</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      <span className="text-green-500">Grátis</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(total)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        ou 12x de {formatPrice(total / 12)} sem juros
                      </p>
                    </div>
                  </div>

                  {checkoutMessage ? (
                    <div
                      className={`rounded-2xl border p-4 mb-4 text-sm ${checkoutStatus === 'success' ? 'border-green-200 bg-green-50 text-green-900' : 'border-destructive bg-destructive/5 text-destructive'}`}
                    >
                      {checkoutMessage}
                    </div>
                  ) : null}

                  <div className="mb-4">
                    <label htmlFor="customerName" className="block text-sm font-medium text-muted-foreground mb-2">
                      Nome do cliente
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isSubmitting || items.length === 0}
                  >
                    {isSubmitting ? 'Finalizando...' : 'Finalizar Compra'}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Pagamento seguro com Stripe e PIX
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

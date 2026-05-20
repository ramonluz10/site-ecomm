import { z } from 'zod'

export const ProductFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
  sku: z.string().min(1, 'SKU é obrigatório'),
  price: z.coerce.number().min(0, 'Preço deve ser maior que 0'),
  stock_quantity: z.coerce.number().int().min(0, 'Quantidade não pode ser negativa'),
  description: z.string().optional(),
  short_description: z.string().optional(),
})

export const SupplierFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  address: z.string().min(1, 'Endereço é obrigatório'),
})

export const InventoryFormSchema = z.object({
  type: z.enum(['entrada', 'saida']),
  product_id: z.string().min(1, 'Produto é obrigatório'),
  quantity: z.coerce.number().int().min(1, 'Quantidade deve ser maior que 0'),
  supplier_id: z.string().optional(),
  note: z.string().optional(),
})

export const SaleFormSchema = z.object({
  customer_name: z.string().min(1, 'Nome do cliente é obrigatório'),
  items: z.array(
    z.object({
      product_id: z.string(),
      quantity: z.coerce.number().int().min(1),
      price: z.coerce.number().min(0),
    }),
  ),
})

export type ProductFormValues = z.infer<typeof ProductFormSchema>
export type SupplierFormValues = z.infer<typeof SupplierFormSchema>
export type InventoryFormValues = z.infer<typeof InventoryFormSchema>
export type SaleFormValues = z.infer<typeof SaleFormSchema>

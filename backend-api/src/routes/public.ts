import { Router } from 'express'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' })
})

router.get('/catalog', (req, res) => {
  res.json({ products: [{ id: 'product-1', name: 'Notebook Corporativo Premium', price: 7999.9 }] })
})

export default router

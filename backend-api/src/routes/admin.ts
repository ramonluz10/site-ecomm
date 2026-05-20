import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { requireRoles } from '../middleware/roles'
import { auditLog } from '../lib/logger'

const router = Router()
router.use(requireAuth)

router.get('/users', requireRoles(['superadmin', 'manager']), (req, res) => {
  auditLog(`ACCESS users route user=${(req as any).user?.username}`)
  return res.json({ users: [{ id: 'admin-1', username: 'admin', role: 'superadmin' }] })
})

router.get('/sales', requireRoles(['superadmin', 'manager', 'finance']), (req, res) => {
  auditLog(`ACCESS sales route user=${(req as any).user?.username}`)
  return res.json({ sales: [{ id: 'sale-1', amount: 1520.5, status: 'concluída' }] })
})

router.get('/suppliers', requireRoles(['superadmin', 'manager']), (req, res) => {
  auditLog(`ACCESS suppliers route user=${(req as any).user?.username}`)
  return res.json({ suppliers: [{ id: 'supplier-1', name: 'Global Tech Fornecedores' }] })
})

router.get('/finance', requireRoles(['superadmin', 'finance']), (req, res) => {
  auditLog(`ACCESS finance route user=${(req as any).user?.username}`)
  return res.json({ summary: { revenue: 125000.0, costs: 54000.0 } })
})

router.get('/logs', requireRoles(['superadmin']), (req, res) => {
  auditLog(`ACCESS logs route user=${(req as any).user?.username}`)
  return res.json({ logs: ['audit: usuário admin acessou o painel'] })
})

router.get('/permissions', requireRoles(['superadmin']), (req, res) => {
  auditLog(`ACCESS permissions route user=${(req as any).user?.username}`)
  return res.json({ roles: ['superadmin', 'manager', 'finance', 'operator'] })
})

export default router

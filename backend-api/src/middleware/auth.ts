import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../lib/jwt'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.admin_access_token
  if (!token) {
    return res.status(401).json({ message: 'Não autorizado' })
  }

  try {
    const payload = verifyAccessToken(token)
    ;(req as any).user = payload
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado' })
  }
}

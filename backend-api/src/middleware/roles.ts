import { Request, Response, NextFunction } from 'express'
import { AccessTokenPayload } from '../types'

export function requireRoles(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as AccessTokenPayload | undefined
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Permissão insuficiente' })
    }

    return next()
  }
}

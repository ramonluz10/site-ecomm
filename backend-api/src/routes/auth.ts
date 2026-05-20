import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt'
import { auditLog } from '../lib/logger'

const router = Router()
interface AdminUserRecord {
  id: string
  username: string
  passwordHash: string
  role: 'superadmin' | 'manager' | 'finance' | 'operator'
  permissions: string[]
}

const users: AdminUserRecord[] = [
  {
    id: 'admin-1',
    username: 'admin',
    passwordHash: bcrypt.hashSync('StrongP@ssw0rd!', 10),
    role: 'superadmin',
    permissions: ['users:read', 'users:write', 'sales:read', 'finance:read', 'suppliers:read', 'logs:read', 'permissions:write'],
  },
]

router.post('/login', async (req, res) => {
  const { username, password } = req.body as { username: string; password: string }
  const user = users.find((item) => item.username === username)
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' })
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash)
  if (!validPassword) {
    return res.status(401).json({ message: 'Credenciais inválidas' })
  }

  const accessToken = signAccessToken({
    sub: user.id,
    username: user.username,
    role: user.role,
    permissions: user.permissions,
  })

  const refreshToken = signRefreshToken(user.id)
  const cookieDomain = process.env.COOKIE_DOMAIN || 'localhost'
  const isProduction = process.env.NODE_ENV === 'production'

  res.cookie('admin_access_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'none',
    domain: cookieDomain,
    maxAge: 15 * 60 * 1000,
  })
  res.cookie('admin_refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'none',
    domain: cookieDomain,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  auditLog(`LOGIN_SUCCESS user=${user.username}`)
  return res.json({ message: 'Autenticado com sucesso', role: user.role })
})

router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies?.admin_refresh_token
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token ausente' })
  }

  try {
    const payload = verifyRefreshToken(refreshToken)
    const userId = payload.sub as string
    const user = users.find((item) => item.id === userId)
    if (!user) {
      return res.status(401).json({ message: 'Usuário inválido' })
    }

    const accessToken = signAccessToken({
      sub: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
    })

    const cookieDomain = process.env.COOKIE_DOMAIN || 'localhost'
    const isProduction = process.env.NODE_ENV === 'production'

    res.cookie('admin_access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'none',
      domain: cookieDomain,
      maxAge: 15 * 60 * 1000,
    })

    return res.json({ message: 'Token renovado' })
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token inválido' })
  }
})

router.post('/logout', (req, res) => {
  const cookieDomain = process.env.COOKIE_DOMAIN || 'localhost'
  const isProduction = process.env.NODE_ENV === 'production'

  res.clearCookie('admin_access_token', { domain: cookieDomain, httpOnly: true, secure: isProduction, sameSite: 'none' })
  res.clearCookie('admin_refresh_token', { domain: cookieDomain, httpOnly: true, secure: isProduction, sameSite: 'none' })
  auditLog(`LOGOUT user=${req.cookies?.admin_access_token ?? 'unknown'}`)
  return res.json({ message: 'Sessão encerrada' })
})

export default router

import jwt from 'jsonwebtoken'
import { AccessTokenPayload } from '../types'

const accessSecret = process.env.JWT_ACCESS_SECRET || 'access-secret'
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret'

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, accessSecret, { expiresIn: '15m' })
}

export function signRefreshToken(userId: string) {
  return jwt.sign({ sub: userId }, refreshSecret, { expiresIn: '7d' })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, accessSecret) as AccessTokenPayload
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshSecret) as jwt.JwtPayload
}

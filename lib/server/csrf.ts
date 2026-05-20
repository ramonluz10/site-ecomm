import { createHash, randomBytes } from 'crypto'

export function generateCsrfToken(sessionId: string): string {
  const random = randomBytes(32).toString('hex')
  const combined = `${sessionId}:${random}`
  return createHash('sha256').update(combined).digest('hex')
}

export function validateCsrfToken(sessionId: string, token: string): boolean {
  const expected = generateCsrfToken(sessionId)
  return token === expected
}

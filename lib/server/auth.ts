import { createHash, randomBytes, timingSafeEqual, scryptSync } from 'crypto'
import { readERPData, writeERPData } from '@/lib/server/erp-db'

const PASSWORD_HASH_LENGTH = 64
const LEGACY_SALT = 'ChangeThisSalt123!'

export function createSalt() {
  return randomBytes(16).toString('hex')
}

export function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, PASSWORD_HASH_LENGTH).toString('hex')
}

export function hashPasswordLegacy(password: string) {
  return createHash('sha256').update(`${LEGACY_SALT}:${password}`).digest('hex')
}

function verifyHash(storedHash: string, computedHash: string) {
  const storedBuffer = Buffer.from(storedHash, 'hex')
  const computedBuffer = Buffer.from(computedHash, 'hex')

  if (storedBuffer.length !== computedBuffer.length) {
    return false
  }

  return timingSafeEqual(storedBuffer, computedBuffer)
}

export async function verifyAdmin(username: string, password: string) {
  const data = await readERPData()
  const user = data.users.find((user) => user.username === username)
  if (!user) {
    return false
  }

  if (user.salt) {
    const hashed = hashPassword(password, user.salt)
    return verifyHash(user.passwordHash, hashed)
  }

  const legacyHash = hashPasswordLegacy(password)
  const isLegacyValid = verifyHash(user.passwordHash, legacyHash)

  if (!isLegacyValid) {
    return false
  }

  const salt = createSalt()
  user.salt = salt
  user.passwordHash = hashPassword(password, salt)
  await writeERPData(data)

  return true
}

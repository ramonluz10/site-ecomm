import { promises as fs } from 'fs'
import path from 'path'

interface RateLimitEntry {
  identifier: string
  attempts: number
  first_attempt_at: string
  locked_until?: string
}

const rateLimitFilePath = path.join(process.cwd(), 'data', 'rate-limits.json')
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 30 * 60 * 1000 // 30 minutes

async function ensureRateLimitFile() {
  try {
    await fs.access(rateLimitFilePath)
  } catch {
    await fs.mkdir(path.dirname(rateLimitFilePath), { recursive: true })
    await fs.writeFile(rateLimitFilePath, JSON.stringify([]), 'utf-8')
  }
}

async function readRateLimits(): Promise<RateLimitEntry[]> {
  await ensureRateLimitFile()
  try {
    const raw = await fs.readFile(rateLimitFilePath, 'utf-8')
    return JSON.parse(raw) as RateLimitEntry[]
  } catch {
    return []
  }
}

async function writeRateLimits(limits: RateLimitEntry[]) {
  await fs.mkdir(path.dirname(rateLimitFilePath), { recursive: true })
  await fs.writeFile(rateLimitFilePath, JSON.stringify(limits, null, 2), 'utf-8')
}

function cleanExpiredEntries(entries: RateLimitEntry[]): RateLimitEntry[] {
  const now = Date.now()
  return entries.filter((entry) => {
    const firstAttempt = new Date(entry.first_attempt_at).getTime()
    return now - firstAttempt < RATE_LIMIT_WINDOW_MS
  })
}

export async function checkRateLimit(identifier: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  const limits = await readRateLimits()
  const cleanedLimits = cleanExpiredEntries(limits)
  const entry = cleanedLimits.find((e) => e.identifier === identifier)
  const now = new Date()

  if (!entry) {
    return { allowed: true }
  }

  if (entry.locked_until) {
    const lockedUntil = new Date(entry.locked_until).getTime()
    if (now.getTime() < lockedUntil) {
      return { allowed: false, retryAfter: Math.ceil((lockedUntil - now.getTime()) / 1000) }
    }
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.ceil(LOCKOUT_DURATION_MS / 1000) }
  }

  return { allowed: true }
}

export async function recordFailedAttempt(identifier: string): Promise<void> {
  const limits = await readRateLimits()
  const cleanedLimits = cleanExpiredEntries(limits)
  const now = new Date()
  const existingIndex = cleanedLimits.findIndex((e) => e.identifier === identifier)

  if (existingIndex >= 0) {
    cleanedLimits[existingIndex].attempts += 1
    if (cleanedLimits[existingIndex].attempts >= MAX_ATTEMPTS) {
      cleanedLimits[existingIndex].locked_until = new Date(now.getTime() + LOCKOUT_DURATION_MS).toISOString()
    }
  } else {
    cleanedLimits.push({
      identifier,
      attempts: 1,
      first_attempt_at: now.toISOString(),
    })
  }

  await writeRateLimits(cleanedLimits)
}

export async function recordSuccessfulAttempt(identifier: string): Promise<void> {
  const limits = await readRateLimits()
  const cleanedLimits = cleanExpiredEntries(limits)
  const updatedLimits = cleanedLimits.filter((e) => e.identifier !== identifier)
  await writeRateLimits(updatedLimits)
}

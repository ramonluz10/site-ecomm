import { cookies } from 'next/headers'
import { getSession, getUserById } from './erp-db'

export type ERPUser = { id: string; username: string; role?: string }

export async function getUserFromCookies(): Promise<ERPUser | null> {
  const cookieJar = await cookies()
  const sessionId = cookieJar.get?.('erp_session')?.value
  if (!sessionId) return null

  const session = await getSession(sessionId)
  if (!session) return null

  const user = await getUserById(session.user_id)
  if (!user) return null

  return { id: user.id, username: user.username, role: user.role }
}

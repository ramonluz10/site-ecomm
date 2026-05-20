export type Role = 'superadmin' | 'manager' | 'finance' | 'operator'

export interface AdminUser {
  id: string
  username: string
  role: Role
  permissions: string[]
}

export interface AccessTokenPayload {
  sub: string
  username: string
  role: Role
  permissions: string[]
}

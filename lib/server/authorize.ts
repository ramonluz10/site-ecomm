import { redirect } from 'next/navigation'
import { getUserFromCookies, ERPUser } from './get-user'
import { allowedRolesByPage, AdminPagePermission } from './permissions'

export async function authorize(allowedRoles?: readonly string[]) {
  const user = await getUserFromCookies()
  if (!user) {
    redirect('/admin/login')
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return user
  }

  const role = user.role
  if (role && (allowedRoles as readonly string[]).includes(role)) {
    return user
  }

  if (user.role === 'estoquista') {
    redirect('/admin/estoque')
  }

  redirect('/admin')
}

export async function authorizePage(page: AdminPagePermission) {
  return authorize(allowedRolesByPage[page])
}

export type ApiAuthorizationResult =
  | { status: 'unauthorized'; user: null }
  | { status: 'forbidden'; user: ERPUser }
  | { status: 'ok'; user: ERPUser }

export async function authorizeApi(page: AdminPagePermission): Promise<ApiAuthorizationResult> {
  const user = await getUserFromCookies()

  if (!user) {
    return { status: 'unauthorized', user: null }
  }

  const role = user.role
  if (!role || !(allowedRolesByPage[page] as readonly string[]).includes(role)) {
    return { status: 'forbidden', user }
  }

  return { status: 'ok', user }
}

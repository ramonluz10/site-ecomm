export type ERPUserRole = 'admin' | 'gestor' | 'ti-admin' | 'gerente-geral' | 'estoquista'

export const allowedRolesByPage = {
  dashboard: ['admin', 'gestor', 'ti-admin', 'gerente-geral'] as const,
  produtos: ['admin', 'gestor', 'ti-admin', 'gerente-geral'] as const,
  fornecedores: ['admin', 'gestor', 'ti-admin', 'gerente-geral'] as const,
  vendas: ['admin', 'gestor', 'ti-admin', 'gerente-geral'] as const,
  relatorios: ['admin', 'gestor', 'ti-admin', 'gerente-geral'] as const,
  estoque: ['admin', 'gestor', 'ti-admin', 'gerente-geral', 'estoquista'] as const,
} as const

export type AdminPagePermission = keyof typeof allowedRolesByPage

export function getAllowedRoles(page: AdminPagePermission) {
  return allowedRolesByPage[page]
}

export function isRoleAllowedForPage(role: string | undefined, page: AdminPagePermission) {
  if (!role) return false
  return (allowedRolesByPage[page] as readonly string[]).includes(role)
}

import { AdminShell } from '../../components/AdminShell'

export default function PermissionsPage() {
  return (
    <AdminShell>
      <div className="admin-panel">
        <h1>Controle por cargo</h1>
        <p>Definição de níveis e regras RBAC para administradores e operadores.</p>
      </div>
    </AdminShell>
  )
}

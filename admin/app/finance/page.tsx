import { AdminShell } from '../../components/AdminShell'

export default function FinancePage() {
  return (
    <AdminShell>
      <div className="admin-panel">
        <h1>Controle financeiro</h1>
        <p>Fluxo de caixa, despesas e receitas com separação de autorização.</p>
      </div>
    </AdminShell>
  )
}

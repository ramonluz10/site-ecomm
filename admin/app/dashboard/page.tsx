import { AdminShell } from '../../components/AdminShell'

export default function DashboardPage() {
  return (
    <AdminShell>
      <div className="admin-panel">
        <h1>Dashboard</h1>
        <p>Visão geral das operações administrativas.</p>
        <div className="card-grid">
          <section className="card">
            <h2>Usuários</h2>
            <p>Gerencie permissões e contas.</p>
          </section>
          <section className="card">
            <h2>Vendas</h2>
            <p>Monitore pedidos e receita.</p>
          </section>
          <section className="card">
            <h2>Fornecedores</h2>
            <p>Controle o cadastro e a saúde do supply chain.</p>
          </section>
        </div>
      </div>
    </AdminShell>
  )
}

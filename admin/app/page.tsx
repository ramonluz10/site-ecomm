import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="admin-landing">
      <div>
        <p className="eyebrow">Painel Administrativo</p>
        <h1>Bem-vindo ao sistema de gestão empresarial</h1>
        <p>Use uma conta de administrador para acessar o dashboard seguro e gerenciar vendas, usuários e relatórios.</p>
        <div className="actions">
          <Link href="/login" className="button">
            Entrar como administrador
          </Link>
        </div>
      </div>
    </main>
  )
}

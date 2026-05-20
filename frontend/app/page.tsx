export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Bem-vindo ao site oficial</p>
          <h1>Infraestrutura de e-commerce empresarial</h1>
          <p>Uma experiência de compra moderna, segura e totalmente separada do sistema administrativo.</p>
          <div className="actions">
            <a href="/produtos" className="button">Ver produtos</a>
            <a href="/contato" className="button button-secondary">Fale com a empresa</a>
          </div>
        </div>
      </section>

      <section className="features">
        <article>
          <h2>Catálogo público</h2>
          <p>Produtos, promoções e conteúdos sem qualquer exposição administrativa.</p>
        </article>
        <article>
          <h2>Segurança empresarial</h2>
          <p>Rota pública isolada do painel administrativo, sem vínculo direto com `/admin`.</p>
        </article>
        <article>
          <h2>Hospedagem corporativa</h2>
          <p>Deploy separado, domínio principal e subdomínio administrativo.</p>
        </article>
      </section>
    </main>
  )
}

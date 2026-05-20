# Deploy no Vercel (Monorepo)

Este guia descreve como publicar as duas aplicações do monorepo no Vercel: o site público (`/frontend`) e o painel administrativo (`/admin`).

Passo a passo rápido

1. Faça push do repositório para o GitHub/GitLab:

```bash
git add .
git commit -m "Preparar deploy Vercel"
git push origin main
```

2. Crie uma conta em https://vercel.com e clique em **Import Project**.

3. Importe duas vezes o mesmo repositório, configurando para cada importação o `Root Directory`:
- Projeto público: selecione `frontend` como `Root Directory`.
- Painel admin: selecione `admin` como `Root Directory`.

4. Durante a importação, o Vercel detecta Next.js automaticamente. Configure as Environment Variables necessárias (veja abaixo).

Variáveis de ambiente recomendadas

- `NEXT_PUBLIC_API_URL` — URL do seu backend (ex.: `https://api.suaempresa.com` ou `https://backend.vercel.app`).
- Qualquer outra variável que seu projeto use (ex.: chaves de serviço). Adicione nas Settings do projeto no Vercel.

Dominio personalizado

1. Em cada projeto no painel Vercel vá em `Settings → Domains` e clique em `Add`. Insira `suaempresa.com` (para site público) e `admin.suaempresa.com` (para painel).
2. O Vercel mostrará os registros DNS necessários — normalmente CNAME para subdomínio e A/AAAA para o apex. Configure-os no provedor de domínio (Cloudflare, GoDaddy, Namecheap, etc.).
3. Após propagação, o Vercel provisiona SSL automaticamente.

Deploy pela CLI (opcional)

```bash
# instalar CLI
npm i -g vercel

# dentro de frontend
cd frontend
vercel --prod

# dentro de admin
cd ../admin
vercel --prod
```

Observações

- Para monorepo, preferível criar um projeto Vercel por subdiretório (frontend e admin) e apontar `Root Directory` corretamente.
- Se você tem também um `backend-api` no monorepo e quer que ele rode como funções, crie um projeto separado apontando para `backend-api`.
- Caso precise, posso gerar os `vercel.json` de configuração (rotas/regras) e um exemplo de `Environment Variables` para você aplicar.

---
Se quiser que eu gere automaticamente os `vercel.json` e um exemplo de `env.production` para cada subprojeto, responda "gerar arquivos" e eu crio no repositório.

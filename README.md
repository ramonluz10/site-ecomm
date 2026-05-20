# Plataforma de E-commerce / ERP Empresarial

Este projeto foi estendido para incluir um sistema de gestão empresarial (ERP) completo integrado ao aplicativo Next.js.

## Funcionalidades implementadas

- Painel administrativo protegido em `app/admin`
- Autenticação de administrador via `/admin/login`
- Dashboard com métricas de fornecedores, produtos, estoque, vendas e receita
- Cadastro e listagem de fornecedores
- Cadastro e listagem de produtos
- Controle de estoque com entradas e saídas
- Registro de vendas integrado ao estoque
- Relatórios de movimentações e vendas
- Persistência local usando `data/erp.json`
- Segurança básica com hash de senha e cookie `httpOnly`

## Estrutura de pastas principais

- `app/admin/layout.tsx` - layout protegido do painel
- `app/admin/page.tsx` - dashboard ERP
- `app/admin/login/page.tsx` - login administrativo
- `app/admin/fornecedores/page.tsx` - gestão de fornecedores
- `app/admin/produtos/page.tsx` - gestão de produtos
- `app/admin/estoque/page.tsx` - controle de estoque
- `app/admin/vendas/page.tsx` - registro de vendas
- `app/admin/relatorios/page.tsx` - relatórios empresariais
- `app/api/admin/auth/login/route.ts` - endpoint de login
- `app/api/admin/auth/logout/route.ts` - endpoint de logout
- `app/api/admin/fornecedores/route.ts` - API de fornecedores
- `app/api/admin/produtos/route.ts` - API de produtos
- `app/api/admin/estoque/route.ts` - API de estoque
- `app/api/admin/vendas/route.ts` - API de vendas
- `lib/server/erp-db.ts` - lógica do ERP e persistência JSON
- `lib/server/auth.ts` - autenticação segura
- `components/admin/` - componentes de formulário, sidebar e gráficos
- `data/erp.json` - base de dados local do ERP

## Como executar

1. Instale dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Acesse:

```text
http://localhost:3000/admin
```

## Credenciais iniciais

- usuário: `admin`
- senha: `StrongP@ssw0rd!`

## Nota

A validação TypeScript foi executada com sucesso usando `npx tsc --noEmit`.

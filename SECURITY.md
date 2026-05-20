# Configuração de Segurança

## Variáveis de Ambiente Recomendadas (para produção)

```bash
# Next.js
NODE_ENV=production

# Supabase (opcional - para dados)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima

# Cookies
# Certifique-se de que o site usa HTTPS em produção
```

## Checklist de Segurança

- ✅ Autenticação com sessão no servidor (não em cookie)
- ✅ Hash de senha com scrypt + salt aleatório
- ✅ Rate limiting (5 tentativas em 15 minutos)
- ✅ CSRF protection em rotas POST/PUT/DELETE
- ✅ Cookies httpOnly e sameSite=strict
- ✅ Expiração de sessão automática (8 horas)
- ✅ Logout destrói sessão no servidor
- ✅ Validação de permissões em páginas e APIs

## Próximos Passos Recomendados

1. **Banco de Dados Real**
   - Migrar de JSON para PostgreSQL/MySQL
   - Usar pooling de conexões
   - Adicionar índices em `users.username` e `sessions.user_id`

2. **Logging e Auditoria**
   - Registrar tentativas de login
   - Registrar alterações de dados
   - Monitorar atividades suspeitas

3. **Secrets Management**
   - Usar variáveis de ambiente para dados sensíveis
   - Adicionar rotação de chaves
   - Usar um serviço de gerenciamento de secrets

4. **HTTPS e Certificados**
   - Forçar HTTPS em produção
   - Usar certificados SSL válidos
   - Adicionar HSTS headers

5. **Validação de Entrada**
   - Adicionar Zod schemas em todas as rotas
   - Sanitizar entradas do usuário
   - Validar tipos de dados

6. **Content Security Policy (CSP)**
   - Adicionar headers CSP
   - Restringir scripts externo

7. **Proteção Contra Ataques**
   - XSS protection
   - SQL injection (se usar banco de dados)
   - CORS configuration
   - Rate limiting para APIs públicas

# Guia: Como Mudar o Nome do Site

O nome do site está centralizado em um único arquivo para facilitar manutenção. Se precisar mudar o nome da loja no futuro, siga este guia:

## 📁 Arquivo Principal

**Localização:** [`lib/config.ts`](lib/config.ts)

Este arquivo contém todas as configurações globais do site, incluindo:
- Nome da loja (`name`: "PragmaticTech")
- Sigla curta (`shortName`: "PT")
- URL do site
- E-mail e telefone
- Links de redes sociais

## 🔄 Locais Onde o Nome Aparece

O nome do site está presente em:

1. **Na aba do navegador** (browser tab)
   - Arquivo: `app/layout.tsx`
   - Forma: Título da página em todas as abas
   - Exemplo: "PragmaticTech - Tecnologia Premium"

2. **No header/cabeçalho**
   - Arquivo: `components/layout/header.tsx`
   - Forma: Logo com o nome ao lado
   - Responsivo: Funciona bem em mobile e desktop

3. **No rodapé (footer)**
   - Arquivo: `components/layout/footer.tsx`
   - Forma: Logo + nome + descrição
   - Copyright: "© 2026 PragmaticTech. Todos os direitos reservados."

4. **Nas meta tags** (SEO)
   - Arquivo: `app/layout.tsx`
   - Onde: Open Graph, Twitter, robots
   - Importante para compartilhamento em redes sociais

## ✏️ Como Mudar o Nome

### Passo 1: Editar o Arquivo de Configuração

Abra o arquivo `lib/config.ts` e mude o valor de `name`:

```typescript
export const SITE_CONFIG = {
  name: 'Seu Novo Nome',  // ← Mude aqui
  shortName: 'SN',        // ← E aqui (sigla)
  description: '...',
  // ... resto da configuração
}
```

### Passo 2: Pronto! ✅

Não precisa mudar mais nada! O nome será atualizado automaticamente em:
- Aba do navegador
- Header do site
- Footer (marca e copyright)
- Meta tags de SEO
- Redes sociais

## 📱 Exemplo Prático

### Antes (Atual)
```
Nome: PragmaticTech
Sigla: PT
```

### Depois (Se mudar para "TechStore")
1. Edit `lib/config.ts`:
```typescript
name: 'TechStore',
shortName: 'TS',
```

2. Resultado automático:
- Aba: "TechStore - Tecnologia Premium"
- Header: Logo + "TechStore"
- Footer: "© 2026 TechStore. Todos os direitos reservados."

## 🔐 Configurações Adicionais

Você pode também mudar no mesmo arquivo `lib/config.ts`:

```typescript
SITE_CONFIG = {
  name: 'PragmaticTech',
  shortName: 'PT',
  description: 'Sua descrição aqui',
  url: 'https://seu-dominio.com',
  email: 'seu-email@dominio.com',
  phone: '+55 (11) 9999-9999',
  socialLinks: {
    instagram: 'https://instagram.com/seu-perfil',
    facebook: 'https://facebook.com/seu-perfil',
    twitter: 'https://twitter.com/seu-perfil',
  },
}
```

## 📌 Dica de Desenvolvimento

Se estiver desenvolvendo e quiser testar com um nome diferente:
1. Mude temporariamente em `lib/config.ts`
2. O Next.js fará hot reload
3. Veja as mudanças aparecerem ao vivo
4. Mude de volta quando terminar

## 🎯 Próximos Passos

Depois de mudar o nome, considere também atualizar:
- Imagens do logo (em `public/`)
- Favicon (em `public/`)
- Cores da marca (em `globals.css`)
- Descrição do repositório

---

**Criado em:** 19 de maio de 2026  
**Última atualização:** Refatoração de branding

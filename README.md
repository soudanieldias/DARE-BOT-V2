# DARE-bot v5

Bot Discord + Painel Admin (Next.js) em monorepo.

## Estrutura

- `apps/bot` - Bot Discord (discord.js, TypeORM)
- `apps/web` - Painel admin (Next.js, NextAuth, Discord OAuth2)
- `packages/database` - Banco PostgreSQL compartilhado (TypeORM)

## Pré-requisitos

- Node.js 18+
- pnpm
- PostgreSQL

## Configuração

1. Copie `.env.example` para `.env` na raiz e para `apps/bot/.env` e `apps/web/.env` (ou `.env.local` no web).
2. Gere `AUTH_SECRET`: `npx auth secret` e coloque em `apps/web/.env`.
3. Configure o OAuth2 do Discord (ver abaixo).

### Configurar OAuth2 do Discord

O login do painel usa a **mesma aplicação** do bot. No [Discord Developer Portal](https://discord.com/developers/applications):

1. Abra sua aplicação (ou crie uma nova).
2. Menu **OAuth2** → **General**:
   - **Client ID**: use no `.env` como `DISCORD_CLIENT_ID` (o mesmo do bot).
   - **Client Secret**: clique em "Reset Secret" se precisar, copie e coloque no `.env` como `DISCORD_CLIENT_SECRET` ou `CLIENT_SECRET`.
3. Em **OAuth2** → **Redirects**:
   - Clique em **Add Redirect**.
   - Adicione **exatamente** (copie e cole, sem espaços nem barra no final):
     - `http://localhost:3000/api/auth/callback/discord`
   - **Importante:** use `http://localhost:3000` no navegador para acessar o painel em dev (não use `http://127.0.0.1:3000`), senão o Discord rejeita o callback.
   - Se quiser usar 127.0.0.1, adicione também como redirect:
     - `http://127.0.0.1:3000/api/auth/callback/discord`
   - Para produção, adicione:
     - `https://seu-dominio.com/api/auth/callback/discord`
   - Salve (**Save Changes**).
4. No `.env` do painel (`apps/web`), confira:
   - `DISCORD_CLIENT_ID` = Application ID (OAuth2 → General).
   - `DISCORD_CLIENT_SECRET` ou `CLIENT_SECRET` = Client Secret (OAuth2 → General).
   - `AUTH_SECRET` = valor gerado com `npx auth secret`.

## Scripts

```bash
pnpm install
pnpm dev          # Bot + Painel juntos
pnpm dev:bot      # Só o bot
pnpm dev:web      # Só o painel (porta 3000)
pnpm build        # Build de tudo
pnpm db:schema:sync  # Sincronizar schema no Postgres
```

## Primeiro uso

1. `pnpm install`
2. Suba o PostgreSQL e configure `DATABASE_URL`
3. `pnpm db:schema:sync`
4. `pnpm dev`

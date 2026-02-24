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

1. Copie `.env.example` para `.env` na raiz
2. Copie as variáveis necessárias para:
   - `apps/bot/.env` (bot)
   - `apps/web/.env.local` (painel)
3. Crie aplicação no [Discord Developer Portal](https://discord.com/developers/applications):
   - Bot: Token e Client ID
   - OAuth2: Client Secret, Redirect URI `http://localhost:3000/api/auth/callback/discord`
4. Gere `AUTH_SECRET`: `npx auth secret`

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

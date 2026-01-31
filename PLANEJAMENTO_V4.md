# Planejamento DARE-bot v4.0.0

Configurações, dependências, lint, banco de dados e extensões para o projeto.

---

## 1. Extensões (Cursor / VS Code)

Instalar via interface ou `code --install-extension <id>`:

| Extensão | ID | Uso |
|----------|-----|-----|
| ESLint | dbaeumer.vscode-eslint | Lint JS/TS |
| Prettier | esbenp.prettier-vscode | Formatação |
| Prisma | Prisma.prisma | Syntax + autocomplete schema |
| Error Lens | usernamehw.errorlens | Erros inline |
| DotENV | mikestead.dotenv-refresh | Destaque .env |

**Opcionais:** GitLens, Thunder Client (API), REST Client.

---

## 2. Prisma vs TypeORM

| Critério | Prisma | TypeORM |
|----------|--------|---------|
| Schema | Arquivo `.prisma` declarativo | Decorators em classes |
| Tipos | Gerados automaticamente | Decorators + reflect |
| Migrations | `prisma migrate` integrado | CLI próprio |
| DX / curva | Rápido, menos boilerplate | Mais conceitos (entities, repos) |
| Bancos | SQLite, PG, MySQL, etc. | Muitos (incl. MongoDB) |

**Recomendação para o bot: Prisma.**  
Schema centralizado, tipos fortes, migrations simples e menos código. TypeORM faz mais sentido se você já usar decorators em todo o projeto ou precisar de recursos avançados (múltiplos bancos, raw SQL complexo).

---

## 3. Dependências de produção

```json
{
  "dependencies": {
    "discord.js": "^14.16.0",
    "dotenv": "^16.4.0",
    "prisma": "^5.22.0",
    "@prisma/client": "^5.22.0"
  }
}
```

**Incluir conforme necessidade:**  
`@discordjs/voice`, `@discordjs/opus`, `ffmpeg-static` (música), `play-dl` ou similar (streaming), etc.

---

## 4. DevDependencies

```json
{
  "devDependencies": {
    "typescript": "^5.6.0",
    "ts-node": "^10.9.2",
    "nodemon": "^3.1.0",
    "@types/node": "^22.0.0",
    "eslint": "^9.15.0",
    "@eslint/js": "^9.15.0",
    "typescript-eslint": "^8.15.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.2.0",
    "prettier": "^3.3.0"
  }
}
```

Opcional: `husky` + `lint-staged` para hooks de pre-commit.

---

## 5. ESLint (flat config – ESLint 9+)

**Arquivo:** `eslint.config.js` (na raiz)

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.ts'],
    plugins: { prettier: prettier },
    languageOptions: {
      parserOptions: { project: './tsconfig.json' },
      globals: { process: 'readonly', __dirname: 'readonly', require: 'readonly' },
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
```

Se preferir config legada: usar `.eslintrc.json` + `parser: @typescript-eslint/parser`, `extends` de `eslint:recommended`, `plugin:@typescript-eslint/recommended`, `prettier`.

---

## 6. Prettier

**Arquivo:** `.prettierrc` (raiz)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**Arquivo:** `.prettierignore`

```
node_modules
dist
.env
*.min.js
prisma/migrations
```

---

## 7. TypeScript

**Arquivo:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 8. Prisma

**Arquivo:** `prisma/schema.prisma` (exemplo mínimo)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

`.env` (exemplo):

```
DATABASE_URL="file:./dev.db"
DISCORD_TOKEN="seu_token"
```

Scripts no `package.json`:  
`"db:generate": "prisma generate"`  
`"db:push": "prisma db push"`  
`"db:migrate": "prisma migrate dev"`  
`"db:studio": "prisma studio"`

---

## 9. Scripts sugeridos no `package.json`

```json
{
  "scripts": {
    "dev": "nodemon --watch src --ext ts --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\"",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  }
}
```

Ajuste `start` se o entry for outro (ex.: `src/index.ts` com `ts-node`).

---

## 10. Estrutura de pastas sugerida

```
src/
  index.ts
  config/
  commands/
  events/
  modules/
  utils/
  types/
prisma/
  schema.prisma
  migrations/
.env.example
.gitignore
.eslintrc.json ou eslint.config.js
.prettierrc
.prettierignore
tsconfig.json
package.json
```

---

## 11. Checklist de configuração

- [ ] Node 18+ (LTS)
- [ ] `package.json` com deps e scripts acima
- [ ] `npm install`
- [ ] ESLint (flat ou .eslintrc) + Prettier
- [ ] `tsconfig.json`
- [ ] Prisma: `schema.prisma`, `.env`, `prisma generate`
- [ ] Extensões no editor
- [ ] Formatar ao salvar (Prettier como default formatter no VS Code/Cursor)
- [ ] Renomear branch para `v4.0.0` (já feito)

---

## 12. Formatar ao salvar (Cursor/VS Code)

Em `.vscode/settings.json` (ou User settings):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

Isso garante Prettier + ESLint na hora de salvar.

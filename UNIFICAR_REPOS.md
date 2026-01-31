# Unificar DARE-bot, DARE-bot-js e DARE-bot-legacy

Objetivo: um único repositório com:
- **main** (oficial) = código atual do DARE-bot
- **v1.0.0** = código do DARE-bot-legacy
- **v2.0.0** = código do DARE-bot-js

---

## Passo a passo (no repositório DARE-bot)

Execute tudo a partir da pasta **DARE-bot** (repositório que será o unificado).

### 1. Adicionar os outros repositórios como remotes

```bash
cd /caminho/para/dare-bot/DARE-bot

git remote add legacy ../DARE-bot-legacy
git remote add js ../DARE-bot-js
```

### 2. Buscar o histórico dos remotes

```bash
git fetch legacy
git fetch js
```

### 3. Criar as branches de versão (preservando histórico)

```bash
git branch v1.0.0 legacy/master
git branch v2.0.0 js/master
```

### 4. (Opcional) Renomear `master` para `main`

Se quiser usar `main` como branch oficial:

```bash
git branch -m master main
git push -u origin main
git push origin --delete master   # só se o remote tiver master
```

### 5. Enviar as novas branches e tags para o GitHub

```bash
git push origin v1.0.0
git push origin v2.0.0
```

### 6. (Opcional) Criar tags para releases

```bash
git tag -a v1.0.0 v1.0.0 -m "Release v1.0.0 (legacy)"
git tag -a v2.0.0 v2.0.0 -m "Release v2.0.0 (JS)"
git push origin v1.0.0 v2.0.0
```

---

## Resultado

- **main** (ou master): versão oficial atual (TypeScript novo).
- **v1.0.0**: branch com o código do legacy; histórico do DARE-bot-legacy preservado.
- **v2.0.0**: branch com o código do JS; histórico do DARE-bot-js preservado.

As branches `v1.0.0` e `v2.0.0` já foram criadas localmente. Para publicar no GitHub: `git push origin v1.0.0 v2.0.0`.

Para trocar de versão: `git checkout main`, `git checkout v1.0.0` ou `git checkout v2.0.0`.

---

## Remover remotes depois (opcional)

Se não for mais usar os remotes locais:

```bash
git remote remove legacy
git remote remove js
```

Os branches `v1.0.0` e `v2.0.0` continuam no repositório.

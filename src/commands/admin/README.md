# Comandos de Presença do Bot

Este diretório contém comandos para gerenciar a presença do bot no Discord.

## Comandos Disponíveis

### `/setactivity`

Define apenas a atividade do bot.

**Parâmetros:**

- `activity` (obrigatório): Tipo de atividade
  - PLAYING - Jogando
  - STREAMING - Transmitindo
  - LISTENING - Ouvindo
  - WATCHING - Assistindo
  - COMPETING - Competindo
- `name` (obrigatório): Nome da atividade
- `url` (opcional): URL para streaming (apenas para STREAMING)

**Exemplo:**

```
/setactivity activity:PLAYING name:Gartic
```

### `/clearactivity`

Remove a atividade atual do bot.

**Exemplo:**

```
/clearactivity
```

### `/getactivity`

Mostra a atividade atual do bot.

**Exemplo:**

```
/getactivity
```

### `/setstatus`

Define apenas o status do bot.

**Parâmetros:**

- `status` (obrigatório): Status do bot
  - online - Online
  - idle - Ausente
  - dnd - Não Perturbe
  - invisible - Invisível

**Exemplo:**

```
/setstatus status:online
```

### `/setpresence`

Define a presença completa do bot (atividade + status).

**Parâmetros:**

- `activity` (obrigatório): Tipo de atividade
- `name` (obrigatório): Nome da atividade
- `status` (obrigatório): Status do bot
- `url` (opcional): URL para streaming

**Exemplo:**

```
/setpresence activity:PLAYING name:Gartic status:online
```

### `/getpresence`

Mostra a presença completa atual do bot.

**Exemplo:**

```
/getpresence
```

### `/resetpresence`

Reseta a presença do bot para os valores padrão definidos no arquivo .env.

**Exemplo:**

```
/resetpresence
```

## Permissões

Todos os comandos requerem permissão de **Administrador** para serem executados.

## Variáveis de Ambiente

Para o comando `/resetpresence` funcionar corretamente, configure as seguintes variáveis no seu arquivo `.env`:

```env
PRESENCE_MESSAGE=seus comandos
BOT_PRESENCE_URL=https://twitch.tv/seu_canal
```

## Tipos de Atividade

- **PLAYING**: "Jogando [nome]"
- **STREAMING**: "Transmitindo [nome]" (requer URL)
- **LISTENING**: "Ouvindo [nome]"
- **WATCHING**: "Assistindo [nome]"
- **COMPETING**: "Competindo em [nome]"

## Status Disponíveis

- **online**: Verde - Bot está online
- **idle**: Amarelo - Bot está ausente
- **dnd**: Vermelho - Bot não perturbe
- **invisible**: Cinza - Bot invisível

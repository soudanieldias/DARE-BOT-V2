# Discord Interactions

## Respostas efêmeras (ephemeral)

A opção `ephemeral: true` foi **descontinuada** pelo discord.js. Use `MessageFlags.Ephemeral`:

```typescript
import { MessageFlags } from 'discord.js';

// Antes (deprecated)
interaction.reply({ content: 'Secret!', ephemeral: true });

// Agora
interaction.reply({ content: 'Secret!', flags: [MessageFlags.Ephemeral] });
```

Para `followUp`, `editReply` e `deferReply`, use o mesmo padrão:

```typescript
await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
await interaction.followUp({ content: '...', flags: [MessageFlags.Ephemeral] });
```

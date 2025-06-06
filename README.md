# Discord Bot Project

Este projeto é um bot para Discord desenvolvido com TypeScript e a biblioteca Discord.js. Abaixo estão as instruções para instalação e uso.

## Estrutura do Projeto

```
dare-bot-V2
├── src
│   ├── index.ts          # Ponto de entrada da aplicação
│   ├── App.ts            # Classe principal que gerencia o bot
│   ├── commands          # Comandos que o bot pode executar
│   ├── modules           # Módulos com funcionalidades específicas
│   ├── events            # Manipuladores de eventos do Discord
│   ├── config            # Configurações do bot
│   └── types             # Tipos e interfaces personalizados
├── package.json          # Configurações do npm
├── tsconfig.json         # Configurações do TypeScript
└── README.md             # Documentação do projeto
```

## Instalação

1. Clone o repositório:

   ```
   git clone <URL_DO_REPOSITORIO>
   ```

2. Navegue até o diretório do projeto:

   ```
   cd discord-bot
   ```

3. Instale as dependências:
   ```
   npm install
   ```

## Uso

1. Configure seu token de bot no arquivo `src/config/index.ts`.

2. Inicie o bot:
   ```
   npm start
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.

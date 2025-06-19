# Lume People - Plataforma de Gestão de Pessoas

![Lume People Logo](https://place-hold.it/120x50/663399/ffffff&text=Lume+People)

**Lume People** é uma plataforma SaaS (Software as a Service) de Gestão de Pessoas com foco em cultura, clima, desempenho e desenvolvimento humano. O objetivo é fornecer um sistema leve, intuitivo e poderoso para líderes, equipes e o setor de RH.

## 🚀 Visão Geral e Arquitetura

O sistema é construído sobre uma stack de tecnologias moderna e robusta, projetada para escalabilidade e manutenibilidade.

-   **Frontend**: React, Next.js (com App Router)
-   **Estilização**: Tailwind CSS com componentes de UI de [shadcn/ui](https://ui.shadcn.com/)
-   **Backend**: API Routes do Next.js (Serverless Functions)
-   **Banco de Dados**: PostgreSQL com [Prisma ORM](https://www.prisma.io/)
-   **Autenticação**: [NextAuth.js](https://next-auth.js.org/)
-   **Testes**: [Jest](https://jestjs.io/) para testes unitários e de integração, e [Playwright](https://playwright.dev/) para testes E2E.
-   **Infraestrutura**: O deploy é feito na [Vercel](https://vercel.com/), utilizando a Prisma Data Platform para o banco de dados.

## 🛠️ Setup de Desenvolvimento Local

Para rodar o projeto localmente, siga os passos abaixo.

### Pré-requisitos
-   Node.js (versão 20.x ou superior)
-   npm ou pnpm/yarn
-   Acesso à Vercel para sincronização de variáveis de ambiente.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_REPOSITORIO]
    cd sistema_gp
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Sincronize as variáveis de ambiente:**
    Este projeto gerencia as variáveis de ambiente (como `DATABASE_URL`) através da Vercel. Execute o comando abaixo para criar um arquivo `.env` local com as variáveis do ambiente de desenvolvimento da Vercel.
    ```bash
    npx vercel env pull .env.local
    ```

4.  **Execute as migrações do banco de dados:**
    Para garantir que seu banco de dados local esteja com o schema mais recente.
    ```bash
    npx prisma migrate dev
    ```

5.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:3000`.

## 📂 Estrutura de Pastas

A organização do projeto segue uma abordagem modular para facilitar a manutenção e escalabilidade.

```
/
├── prisma/                # Schema, seeds e migrações do banco
├── public/                # Arquivos estáticos
├── src/
│   ├── app/               # Rotas e páginas (App Router)
│   │   ├── (auth)/        # Rotas de autenticação
│   │   ├── api/           # Endpoints da API
│   │   └── (main)/        # Rotas principais da aplicação
│   ├── components/        # Componentes React reutilizáveis
│   ├── lib/               # Utilitários, lógica de negócio, configs
│   └── services/          # Lógica de serviço mais complexa (vazio por enquanto)
├── tests/                 # Suítes de testes
│   ├── unit/              # Testes unitários
│   ├── integration/       # Testes de integração (com BD)
│   └── e2e/               # Testes end-to-end (Playwright)
├── .env.local             # Variáveis de ambiente (gerado pelo Vercel)
├── next.config.mjs        # Configurações do Next.js
└── tsconfig.json          # Configurações do TypeScript
```

## ✅ Como Rodar os Testes

O projeto possui uma suíte de testes robusta para garantir a qualidade e estabilidade do código.

-   **Rodar todos os testes (unitários e integração):**
    ```bash
    npm test
    ```

-   **Rodar um arquivo de teste específico:**
    ```bash
    npm test -- tests/integration/evaluation-calculation.test.ts
    ```

-   **Verificar a cobertura de testes:**
    ```bash
    npm test -- --coverage
    ```

-   **Rodar os testes End-to-End (E2E) com Playwright:**
    ```bash
    npx playwright test
    ```

## 🌐 Deploy

O deploy é gerenciado pela Vercel e acontece automaticamente a cada push na branch `main`.

-   **Para fazer deploy em produção:**
    ```bash
    npm run deploy:production
    ```
-   **Para aplicar migrações no banco de produção:**
    *Atenção: esta é uma operação crítica.*
    ```bash
    npm run db:deploy
    ```

##  Dúvidas e Troubleshooting

-   **Erro `TextEncoder is not defined` nos testes:**
    Certifique-se de que o `testEnvironment` em `jest.config.ts` está configurado como `'node'`.

-   **Erro de permissão no banco de dados durante os testes:**
    A função `cleanupDatabase` em `tests/helpers/db.ts` usa `deleteMany` em vez de `TRUNCATE` para evitar problemas de permissão em bancos de dados gerenciados. Verifique se o seu usuário de banco de dados tem permissão para `DELETE`.

-   **Tipos do Prisma desatualizados:**
    Se você alterar o `schema.prisma`, sempre rode `npx prisma generate` para garantir que os tipos do Prisma Client sejam atualizados. 
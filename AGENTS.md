## Seção 0: Contexto e Visão do Produto - Lume People

Este documento serve como um guia para agentes de IA que auxiliam no desenvolvimento do sistema **Lume People**. Compreender seu produto, arquitetura e objetivos é crucial para o desenvolvimento.

### 0.1. Visão e Identidade do Produto

-   **Nome**: Lume People
-   **Missão**: Ser uma plataforma de Gestão de Pessoas com foco em cultura, clima, desempenho e desenvolvimento humano dentro das empresas.
-   **Proposta de Valor**: Um sistema SaaS leve, intuitivo, com design moderno e, acima de tudo, útil para líderes, equipes e o setor de RH.

### 0.2. Princípios Fundamentais de Desenvolvimento

Este é o ponto de partida para o Lume People. O projeto está sendo construído do zero, e os seguintes princípios devem guiar cada decisão de arquitetura e codificação:

1.  **Escalabilidade em Primeiro Lugar**: Todas as funcionalidades devem ser projetadas pensando no crescimento. Isso significa criar componentes, serviços e modelos de dados que possam evoluir sem a necessidade de refatorações massivas.
2.  **Modularidade Extrema**: O código deve ser organizado em módulos pequenos, coesos e com responsabilidades bem definidas. Evite arquivos longos e funções que fazem mais de uma coisa. A lógica de negócio deve ser desacoplada da UI.
3.  **Código Limpo e Iterativo**: Escrevemos código para humanos. Ele deve ser claro, legível e de fácil manutenção. O desenvolvimento será iterativo, começando com o MVP e evoluindo, mas a qualidade e a clareza nunca devem ser sacrificadas pela velocidade.
4.  **Fonte Única da Verdade**: O `schema.prisma` não é apenas uma definição de banco de dados; é a documentação central do nosso domínio de negócio. Ele deve ser ricamente comentado, e o padrão de nomenclatura (`camelCase`) deve ser seguido rigorosamente.

### 0.3. Módulos e Funcionalidades

O Lume People é projetado para ser um sistema modular, começando com um MVP focado e evoluindo para uma suíte completa.

#### 🚀 **MVP (Primeiro Passo)**

1.  **Autenticação**: Login e cadastro de usuários.
2.  **Gestão de Colaboradores**: Cadastro com dados básicos, cargo e setor.
3.  **Check-in de Clima**: Interface simples (emojis, escala, texto) para registros diários ou semanais.
4.  **Dashboard de Clima**: Painel com indicadores básicos (humor positivo/neutro/negativo) e gráficos.
5.  **Kanban Simplificado**: Quadros, colunas e cartões personalizáveis para processos internos (onboarding, PDI, etc.).
6.  **Módulo de Feedback**: Envio de feedbacks rápidos (positivo, sugestão) entre usuários.

#### 🔥 **Roadmap de Evolução (Próximos Passos)**

-   **Avaliação de Desempenho**: Suporte a modelos 90°, 180° e 360°.
-   **Plano de Desenvolvimento Individual (PDI)**: Conectado às avaliações de desempenho.
-   **Gestão de Metas (OKRs/KRs)**.
-   **Sistema de Reconhecimento Peer-to-Peer**: Kudos, estrelas, badges.
-   **Check-ins de Bem-Estar**: Foco em energia, estresse, motivação.
-   **Relatórios Preditivos**: Análise de riscos de turnover, burnout.
-   **Integrações**: Slack, Teams, ERPs, sistemas de folha de pagamento.
-   **App mobile (via PWA)** com notificações push, check-ins, feedbacks e dashboards pessoais

### 0.4. Tecnologias e Arquitetura Sugerida

-   **Frontend**: React, Next.js, Tailwind CSS
-   **UI Components**: shadcn/ui
-   **Backend**: API Routes do Next.js
-   **Banco de Dados**: PostgreSQL com Prisma ORM
-   **Autenticação**: NextAuth.js
-   **Infraestrutura**: Vercel
-   **Bibliotecas de Apoio**:
    -   **Kanban**: `react-beautiful-dnd` (ou similar)
    -   **Gráficos**: `Recharts` ou `Chart.js`

---

# AGENTS.MD - Guia para Agentes de IA

Este documento serve como um guia para agentes de IA que auxiliam no desenvolvimento deste projeto. Ele contém informações cruciais sobre a arquitetura, convenções e processos.

## Seção 1: Configuração e Ambiente

### 1.1. Informações Cruciais sobre o Setup do Banco de Dados

Ao discutir o banco de dados deste projeto, por favor, considere:

1.  **Hospedagem do Banco de Dados:**
    *   O banco de dados PostgreSQL está hospedado na **Prisma Data Platform (integrado com a Vercel)** ou pode ser descrito como **Prisma Postgres fornecido pela Vercel**.

2.  **Gerenciamento de Variáveis de Ambiente (DATABASE_URL):**
    *   As variáveis de ambiente, incluindo a `DATABASE_URL` para produção, são gerenciadas e injetadas pela **Vercel**.
    *   Para desenvolvimento local e execução de operações no banco de dados (`prisma migrate dev`, `prisma db push`), a `DATABASE_URL` (com a string de conexão direta `postgresql://...`) é obtida executando o comando `vercel env pull .env` (ou `vercel env pull .env.development.local`) na raiz do projeto. Este comando cria/atualiza o arquivo `.env` local com as variáveis da Vercel.

3.  **Uso do Prisma Accelerate/Data Proxy:**
    *   A aplicação em produção utiliza o **Prisma Accelerate**, conectando-se via uma URL no formato `prisma://...` para otimizar as queries.
    *   É entendido que, para migrações e `db push` local, a URL de conexão direta `postgresql://...` (obtida via `vercel env pull`) é necessária e deve ser usada no arquivo `.env`.

**Exemplo de Contexto Inicial para o Agente ao Discutir Banco de Dados:**

"Olá, estou trabalhando neste projeto Next.js com Prisma. Meu banco de dados é o **Prisma Postgres, gerenciado pela Vercel**. Estou tentando [descreva sua tarefa, ex: 'configurar uma nova tabela', 'resolver um problema de migração']. Minhas variáveis de ambiente são gerenciadas pela Vercel, e para desenvolvimento/migrações locais, obtenho a `DATABASE_URL` direta com `vercel env pull .env`. A aplicação usa Prisma Accelerate em produção."

### 1.2. Estrutura do Projeto

O sistema utiliza Next.js (versão 13+ com App Router) e segue uma organização modular:

```
/
├── prisma/
│   └── schema.prisma      # Definição do banco de dados (Modelos, Enums)
├── public/                # Arquivos estáticos (imagens, manifest.json, sw.js para PWA)
├── src/
│   ├── app/               # Rotas e páginas (App Router)
│   │   ├── (auth)/        # Rotas de autenticação (ex: /login)
│   │   ├── api/           # Endpoints da API (ex: /api/collaborators, /api/check-ins)
│   │   │   └── push/      # Rotas para subscrição de notificações PWA
│   │   └── (main)/        # Rotas principais da aplicação após login
│   │       ├── dashboard/ # Dashboard de clima
│   │       ├── kanban/    # Página do Kanban
│   │       └── ...        # Outras seções da aplicação
│   ├── components/        # Componentes React reutilizáveis
│   │   ├── auth/          # Componentes de autenticação
│   │   ├── people/        # Componentes para módulos de gestão de pessoas
│   │   └── ui/            # Componentes UI genéricos (Button, Input, Card - Shadcn/ui)
│   ├── lib/               # Utilitários, lógica de negócio, configurações
│   │   ├── prisma.ts      # Instância global do PrismaClient (ou db.ts)
│   │   ├── auth.ts        # Configurações do NextAuth.js (authOptions)
│   │   ├── utils.ts       # Funções utilitárias gerais
│   │   └── zod/           # Schemas de validação Zod
│   └── services/          # Lógica de serviço mais complexa
├── .env                   # Variáveis de ambiente locais (gerenciado por `vercel env pull`)
├── next.config.js         # Configurações do Next.js
└── tsconfig.json          # Configurações do TypeScript
```

## Seção 2: Banco de Dados e Modelagem (MVP)

O sistema utiliza PostgreSQL com Prisma ORM. O schema para o MVP está em `/prisma/schema.prisma`.

### 2.1. Principais Entidades (Modelos Prisma do MVP)

-   **User**: Usuários do sistema (geralmente via NextAuth). `id, email, name, role`.
-   **Collaborator**: Representa um funcionário na plataforma. Vinculado a um `User`.
    -   `id, userId, companyId, name, email, role, department, status`
-   **ClimateCheckIn**: Registro de um check-in de humor/clima.
    -   `id, collaboratorId, date, rating (enum), comment (optional)`
-   **Feedback**: Um feedback enviado de um colaborador para outro.
    -   `id, giverId (Collaborator), receiverId (Collaborator), content, type (enum: POSITIVE, IMPROVEMENT, SUGGESTION)`
-   **KanbanBoard**: Um quadro Kanban (ex: "Processo de Onboarding").
    -   `id, name, companyId`
-   **KanbanColumn**: Uma coluna dentro de um quadro Kanban (ex: "Para Fazer", "Em Andamento").
    -   `id, boardId, title, order`
-   **KanbanCard**: Um cartão dentro de uma coluna.
    -   `id, columnId, title, description, order, assignedToId (Collaborator, optional)`

*Nota: Modelos como `Account`, `Session`, `VerificationToken` também serão gerenciados pelo adapter do NextAuth com o Prisma e seguirão a convenção de nomenclatura da biblioteca (`camelCase`).*

-   **PushSubscription**: Armazena as inscrições para notificações PWA, permitindo o envio de alertas (ex: novo feedback).
    -   `id, endpoint, p256dh, auth, userId`

### 2.2. Documentando o Schema

É **mandatório** usar os comentários de três barras (`///`) no `schema.prisma` para documentar o propósito de cada modelo e de cada campo que não seja autoexplicativo.

Exemplo:
```prisma
/// Representa um funcionário dentro de uma empresa na plataforma.
model Collaborator {
  id          String @id @default(cuid())
  /// Vincula ao usuário autenticável do sistema.
  userId     String
  /// A qual empresa este colaborador pertence.
  companyId  String
  name        String
  // ... resto dos campos
}
```

## Seção 3: Convenções e Padrões

### 3.1. Nomenclatura
-   **Componentes React**: PascalCase (Ex: `CollaboratorCard.tsx`)
-   **Arquivos de utilitários, serviços, hooks**: camelCase (Ex: `dateFormatter.ts`, `useKanbanState.ts`)
-   **Rotas Next.js**: `page.tsx`, `layout.tsx`, `route.ts`
-   **Variáveis e Funções (TypeScript/JS)**: camelCase
-   **Modelos e Enums Prisma**: PascalCase (Ex: `ClimateCheckIn`, `FeedbackType`)
-   **Campos no `schema.prisma` (e colunas no DB)**: **camelCase**. Esta é uma diretriz fundamental do projeto. (Ex: `userId`, `createdAt`). Prisma irá mapear para `user_id` no banco de dados por padrão, mas nosso código TypeScript usará `camelCase`.

### 3.2. Padrões de Código
-   **Separação de Responsabilidades**: Isolar lógica de negócio (`lib/`, `services/`) da UI (`components/`, `app/`). Os componentes devem ser o mais "burros" possível.
-   **Modularidade e Tamanho**: Nenhum arquivo deve ser excessivamente longo. Uma função deve fazer apenas uma coisa. Um componente deve ter uma única responsabilidade. Se um arquivo ou função começar a crescer, considere-o um sinal para refatoração.
-   **Server Components por Padrão**: Usar `'use client';` apenas quando estritamente necessário (interatividade, hooks de estado/efeito).
-   **Validação com Zod**: Validar todos os payloads de API e dados de formulários.
-   **Tipagem Forte**: Usar tipos gerados pelo Prisma e definir interfaces claras.

## Seção 4: Guia para Modificações Comuns

### 4.1. Alterar o Schema do Prisma

1.  **Modifique `/prisma/schema.prisma`**.
2.  **Sincronize o Banco de Dados:**
    *   **Para gerar migração (recomendado)**: `npx prisma migrate dev --name nome_da_alteracao`
    *   **Para "empurrar" o schema (desenvolvimento inicial)**: `npx prisma db push`
3.  **Atualize o Código**: Ajuste queries e tipos na aplicação conforme a mudança.

### 4.2. Criar uma Nova Rota de API

1.  **Crie o arquivo**: Ex: `/src/app/api/people/check-ins/route.ts`.
2.  **Implemente os métodos HTTP**: `GET`, `POST`, `PUT`, `DELETE`.
3.  **Use o Prisma Client** para acessar o banco.
4.  **Valide Payloads com Zod**.
5.  **Retorne `NextResponse.json()`**.

Exemplo (`/src/app/api/people/check-ins/route.ts`):
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const checkInCreateSchema = z.object({
  collaboratorId: z.string().cuid(),
  rating: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']),
  comment: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // TODO: Adicionar verificação de autenticação e autorização
    const body = await request.json();
    const validatedData = checkInCreateSchema.parse(body);

    const newCheckIn = await prisma.climateCheckIn.create({
      data: validatedData,
    });

    return NextResponse.json(newCheckIn, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error creating check-in:", error);
    return NextResponse.json({ error: 'Error creating check-in' }, { status: 500 });
  }
}
```

### 4.3. Adicionar um Novo Componente React

1.  **Crie o arquivo**: Ex: `/src/components/people/CheckInForm.tsx`.
2.  **Defina Props com TypeScript**.
3.  **Implemente a lógica e UI**, decidindo entre Server/Client Component.
4.  **Estilize com Tailwind CSS e Shadcn/ui**.

## Seção 5: Fluxos de Negócio Principais (MVP)

### 5.1. Fluxo de Check-in de Clima

-   **Objetivo**: Permitir que um colaborador registre seu clima/humor.
-   **Arquivos Principais**:
    -   `/src/app/(main)/dashboard/page.tsx`: Onde o componente de check-in pode ser exibido.
    -   `/src/components/people/CheckInForm.tsx`: O formulário para o usuário interagir.
    -   `/src/app/api/people/check-ins/route.ts`: API para receber e salvar o registro.
    -   `/src/services/climateService.ts`: Lógica de negócio (calcular médias, etc.).
-   **Fluxo Simplificado**:
    1.  Usuário vê o `CheckInForm` no Dashboard.
    2.  Seleciona o humor e envia.
    3.  O componente chama a API `POST /api/people/check-ins`.
    4.  A API valida os dados e usa o `prisma.climateCheckIn.create` para salvar.
    5.  O Dashboard é atualizado (via revalidação ou SWR/TanStack Query).

### 5.2. Fluxo de Gestão com Kanban

-   **Objetivo**: Permitir a criação e manipulação de quadros, colunas e cartões.
-   **Arquivos Principais**:
    -   `/src/app/(main)/kanban/[board_id]/page.tsx`: Página que renderiza um quadro específico.
    -   `/src/components/kanban/KanbanBoard.tsx`: Componente principal que renderiza colunas e cartões (usando `react-beautiful-dnd`).
    -   `/src/app/api/kanban/cards/route.ts` (e `[id]/route.ts`): APIs para CRUD de cartões, colunas, etc.
-   **Fluxo Simplificado**:
    1.  Usuário acessa a página de um quadro Kanban.
    2.  `KanbanBoard.tsx` busca os dados do quadro, colunas e cartões via API.
    3.  Usuário arrasta um cartão para uma nova coluna.
    4.  O evento `onDragEnd` da biblioteca de D&D é acionado.
    5.  A função de callback chama a API `PUT /api/kanban/cards/[cardId]` para atualizar a `columnId` e a `order` do cartão.

### 5.3. Fluxo de Envio de Feedback

-   **Objetivo**: Permitir que um colaborador envie um feedback para outro.
-   **Arquivos Principais**:
    -   `/src/components/people/FeedbackModal.tsx`: Modal para escrever e enviar o feedback.
    -   `/src/app/api/people/feedbacks/route.ts`: Endpoint para salvar o feedback.
-   **Fluxo Simplificado**:
    1.  Usuário clica em "Dar Feedback" em um perfil ou botão geral.
    2.  `FeedbackModal.tsx` é aberto.
    3.  Usuário seleciona o destinatário, tipo de feedback e escreve a mensagem.
    4.  Ao enviar, o modal chama a API `POST /api/people/feedbacks`.
    5.  A API valida os dados, verifica permissões e salva o feedback no banco.

### 5.4. Fluxo de Notificações Push (PWA)

-   **Objetivo**: Engajar usuários com notificações sobre eventos relevantes, como novos feedbacks ou menções em cartões do Kanban.
-   **Arquivos Principais**:
    -   `/src/app/_components/PWAProvider.tsx`: Componente que gerencia a lógica de subscrição no frontend.
    -   `/src/app/api/push/subscribe/route.ts`: Endpoint para salvar a subscrição do usuário no banco.
    -   `/src/app/api/push/send/route.ts`: Endpoint (protegido) para disparar notificações.
    -   `/public/sw.js`: Service Worker que escuta por eventos de push.
-   **Fluxo Simplificado**:
    1.  O `PWAProvider` no frontend solicita permissão ao usuário para enviar notificações.
    2.  Se permitido, ele obtém o objeto de subscrição do navegador e o envia para a API `/api/push/subscribe`.
    3.  A API salva os dados da subscrição no modelo `PushSubscription`, associando-o ao `userId`.
    4.  Quando um evento relevante ocorre (ex: um feedback é criado no `feedbackService`), o backend busca a subscrição do destinatário e envia uma notificação push.
    5.  O Service Worker no cliente recebe a notificação e a exibe para o usuário.

## Seção 6: Qualidade e Processos

### 6.1. Segurança e Boas Práticas
1.  **NUNCA** exponha segredos no código. Use variáveis de ambiente.
2.  **Valide TODAS as entradas** no backend com Zod.
3.  **Use o Prisma Client** para prevenir injeção de SQL.
4.  **Autorização**: Verifique permissões do usuário em todas as operações de API.
5.  **Logs**: Implemente logs para operações críticas e erros.

### 6.2. Testes
1.  **Unitários (Jest)**: Para lógica de negócio complexa e utilitários.
2.  **Integração**: Para endpoints da API.
3.  **End-to-End (Playwright/Cypress)**: Para fluxos de usuário críticos.

### 6.3. Processo de Desenvolvimento Sugerido
1.  **Compreensão da Tarefa**.
2.  **Planejamento**: Identifique os arquivos a serem modificados/criados.
3.  **Implementação**: Siga as convenções do projeto.
4.  **Testes Locais**.
5.  **Documentação**: Atualize este `AGENTS.MD` se necessário.
6.  **Deploy**: Via Vercel.

### 6.4. Commits Rápidos com Script (git-quick)

Para agilizar o processo de commit, o script `git-quick - alternativa.bat` está disponível e pode ser usado da mesma forma que no projeto anterior para commits rápidos e iterativos na branch `alternativa`.

**Como Usar:**
```powershell
.\"git-quick - alternativa.bat"
```
Use para prototipagem e desenvolvimento rápido. Para features consolidadas, use mensagens de commit descritivas. 
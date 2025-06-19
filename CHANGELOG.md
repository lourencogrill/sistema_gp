# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - YYYY-MM-DD

### Adicionado
-   **Release Inicial do Lume People!**
-   Módulo de **Gestão de Cargos** com requisitos, atividades e perfil comportamental.
-   Módulo de **Avaliação de Desempenho** com múltiplos modelos e cálculo automático de pontuação.
-   Módulo de **Organograma** para visualização da hierarquia.
-   Módulo de **Analytics** com dados sobre a estrutura organizacional.
-   Sistema de **Autenticação** com NextAuth.js.
-   Arquitetura **Multi-tenancy** baseada em path (`/empresa/dashboard`).
-   Sistema de **Permissões** com 4 níveis (ADMIN, HR_MANAGER, MANAGER, EMPLOYEE).
-   **Testes de Integração** com Jest para a lógica de cálculo de avaliação.
-   Configuração de **Deploy** para a Vercel.
-   Navegação principal com **Sidebar** dinâmica.

### Mudanças

-   Projeto pivotado de um sistema de Kanban/Feedback para uma plataforma completa de Avaliação de Desempenho.

### Corrigido

-   Múltiplos problemas de configuração de ambiente de teste (Jest, Prisma, `TextEncoder`).
-   Inconsistências de tipagem com o cliente Prisma.

## [0.1.0] - YYYY-MM-DD (Não lançado)

### Adicionado
-   Prova de conceito inicial com Kanban, Feedback e Check-in de Clima.
-   Schema inicial do Prisma para o MVP.
-   Setup básico do Next.js. 
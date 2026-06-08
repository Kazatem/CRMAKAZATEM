# CRMAKAZATEM
CRM para vendas com atendimento unificado de WhatsApp, Direct e comentários, assistente de vendas inteligente e painel administrativo.

## O que já está pronto

- Frontend em React com Vite
- Backend em Express com endpoints iniciais
- Telas de atendimento com abas de canal
- Assistente de vendas lateral para sugestões de respostas
- Painel administrativo com ranking de vendedores

## Como usar

1. Instale dependências:
   ```bash
   npm install
   ```
2. Configure o banco PostgreSQL e crie um arquivo `.env` com as variáveis:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crmakazatem
   JWT_SECRET=troque-esta-chave-por-uma-segura
   PORT=4000
   ```
3. Inicie o banco de dados com Docker Compose:
   ```bash
   npm run db:up
   ```
4. Rode o seed para criar tabelas e usuários iniciais:
   ```bash
   npm run seed
   ```
5. Inicie em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
6. Acesse o frontend no endereço exibido pelo Vite (normalmente `http://localhost:5173`).

> Para parar o banco de dados do Docker depois dos testes:
> ```bash
> npm run db:down
> ```

## Acesso inicial

- Administrador: `kazatemimports01@gmail.com` / `12345678`
- Vendedor: `pauloricardobatistadas@gmail.com` / `12345678`

O backend usa a porta definida em `PORT` (padrão `4001`) e o frontend usa a porta exibida pelo Vite.

## Próximos passos

- Conectar WhatsApp Business API e Instagram Graph API
- Adicionar agenda de disparo de mensagens e automações de aniversário
- Treinar a IA para responder como vendedora de cama, mesa e banho
- Implementar histórico de follow-up, ranking em tempo real e intervenção de admin

## Novidades implementadas

**Painel do Vendedor:**
- Cadastro de clientes com busca por nome
- Registro de vendas com seleção de cliente existente ou novo
- Filtros de vendas por cliente e intervalo de datas
- Lista de clientes com histórico de cadastros

**Painel do Admin:**
- Gestão centralizada de todas as vendas com filtros avançados
- Visualização de clientes cadastrados pela empresa inteira
- Dashboard com métricas consolidadas (faturamento, vendedores ativos, total de vendas)
- Relatórios com ranking de performance dos vendedores
- Filtro de vendas por vendedor, cliente e período

**Autenticação:**
- Interceptador 401 que remove token e redireciona para `/login`
- Logout automático ao token expirar

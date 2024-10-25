# Mudanças
## Página Inicial 
> Caminho: app/(home)/page.tsx
- Apenas algumas importações em desuso foram retiradas
## Formulário de Despesas 
> Caminho: app/_components/dialogDespesaVariavel.tsx
- Inserção da validação pelo Zod
- Adicionado interfaces do Bank e do ChildCompentProps
- Iniciado a ação do submit para armazenar os dados do formulário
- O dialog recebeu o componente "Form" para ter as funções de um formulário
- Grande parte do código antigo foi comentado e deverá ser analisado para ver se tudo foi construído novamente e não há partes restantes
## Interface do NextAuthOptions
> Caminho: app/_lib/auth.ts
- Foi inserido a passagem e armazenamento do ID do usuário no JWT e na Session
## Criação da rota de inserção de transações no banco de dados
> Caminho: app/api/expenses/create/royte.tsx
- Criada nesta atualização e precisa de revisão para seu funcionamento (Contém erros).
## Criação da rota para listar os Bancos
> Caminho: app/api/getBanks/route.tsx
- Esta rota foi criada nesta atualização e tem a função de fazer a busca e retorno dos bancos presentes no banco de dados.
## Tela das Tabelas de Entradas e Saídas
> Caminho: app/dashboard/page.tsx
- Mudança no import do next-auth/react e do react
- Alteração dos dados mockados das tabela de visualização de despesas variáveis, fixas e entradas.
- Alteração das tabelas de visualização (Serão trabsformadas em DataTables em breve).
- Os componentes dos Dialogs DialogDPV agora recebem, através de props, o ID do usuário da sessão.
## Popover: Notificações do Sistema
> Caminho: componentes/ui/popover.tsx
- Inserção do código nesta atualização
## Banco de Dados / Esquema do Prisma
> Caminho: prisma/schema.prisma
### Muitas modificações foram necessárias aqui e poderão ocorrer mais a medida que o necessário.
- User
  - Recebeu as ligações com Transações, Categorias, Cartões, Lista de Desejos e Decisão de Compra
- Account
  - Apenas recebeu a ligação correta com User
- Session
  - Recebeu uma formatação apenas
- Transacao
  - Recebeu as ligações corretas com User, Categoria, TipoTransacao (Enum), TipoMovimento (Enum), TipoPagamento, Cartao e TipoInvestimento (Atualmente uma Enum, mas futuramente pode ser uma tabela comum).
- Categoria
  - Recebeu ligações corretas com User, Transacao, DesicaoDeCompra
  - Formatada pra melhor visualização
- Cartao
  - Ligações corretas: Transacao, Banco, User
  - Formatada
- Banco
  - Ligações corretas: Cartao
- Tabelas totalmente novas:
  - TipoPagamento
  - ListaDeDesejos
  - DesicaoDeCompra
- Enums:
  - TipoTransacao
  - TipoMovimento
  - TipoInvestimento
## Seed
> Caminho: prisma/seed.mjs
- Semente do prisma com funcionalidade de popular os bancos
## Migrações realizadas pelo Prisma
> Caminho: prisma/migrations/...
- Gerenciado pelo Prisma ORM


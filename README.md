# Mudanças

## AJUSTES DO VERCEL 1.4
- Ajustes do Supabase
- Forçar que APIs sejam dinâmicas
- Modificações em next.config.mjs

## Correção no Excesso de Conexões Prisma
> modified:   app/api/cards/route.ts
> modified:   app/api/categories/delete/route.ts
> modified:   app/api/categories/getByUserId/route.ts
> modified:   app/api/decisions/route.ts
> modified:   app/api/desires/route.ts
> modified:   app/api/getBanks/route.tsx
> modified:   app/api/getPaymentMethod/route.tsx
> modified:   app/api/transactions/delete/route.ts
> modified:   app/api/transactions/getTransactions/route.ts        
- As APIs listadas estavam utilizando uma conexão incorreta com o Prisma, chegando a um limite de requisições abertas, o que acaba travando travando a requisição de nº 100 e adiante ( Limite padrão do Prisma e Banco de Dados).        

## Alterações das Tabelas de Saída
> modified:   app/dashboard/_components/dataTableVariableExpenses.tsx       
- Adicionado paginação, inicialmente limitado de 10 em 10.
- Botões ao fim da tabela, para avançar ou retroceder páginas.
- Adicionado a ordenação das colunas.
- Ajuste no texto para quando não há registros.

## Alterações no Criador de Gráficos
> modified:   app/dashboard/_components/resumeAllChart.tsx
- Criado um gráfico padrão para quando não se há registros.
- Lógica para o Tooltip não ser utilizado sem dados.
- Modificações no tamanho do conteiner responsivel, afim de resolver o problema com tooltips sendo cobertos por limite de tamanaho.
- Cores cinzas aos gráficos que não possuem dados.

## Seleção de Data
> modified:   app/dashboard/page.tsx
- Adicionado o texto-título que permite se mover dentre os meses e anos.
- Botões para movimento mês á mês.
- Adicionado botão com ícone de calendário.
- Adicionado calendário com seleção de mês e ano específico.

## Ordenação em Coluna
> modified:   app/dashboard/_components/variableExpensesColumns.tsx
- Adicionado importações de ícones e botões.
- Cabeçalho de cada coluna foi modificada pra receber a função e visual de ordenação.

## Correção em Dialog
> modified:   app/categories/_components/dialogEditCategory.tsx
- Implementação da lógica de fechamento do dialog.
- Remoção de comentários em código.

## Removido
> deleted:    app/dashboard/css/base.css
> deleted:    app/dashboard/css/sandbox.css
- Arquivos de CSS trazidos do Embla que não serão utilizados.



        
        
	
	
	


	



	


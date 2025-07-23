# Mudanças
- Resumo das Últimas Atualizações

## Simplificação das APIs
> deleted:    app/api/categories/create/route.ts
> deleted:    app/api/categories/delete/route.ts
> deleted:    app/api/categories/getByUserId/route.ts
> deleted:    app/api/categories/update/route.ts
- Os caminhos acima foram todos reorganizados para o documento:
> added: app/api/categories/route.ts
- E repetido nas rotas da transactions:
> deleted:    app/api/transactions/create/route.ts
> deleted:    app/api/transactions/delete/route.ts
> deleted:    app/api/transactions/getTransactions/route.ts
> deleted:    app/api/transactions/update/route.ts
> added: app/api/transactions/route.ts

## Correção de Rotas
> modified:   app/categories/_components/categoryCardList.tsx
> modified:   app/categories/_components/dialogAddNewCategory.tsx
> modified:   app/categories/_components/dialogEditCategory.tsx
> modified:   app/dashboard/_components/actionsForColumns.tsx
> modified:   app/dashboard/_components/dialogEditDespesaVariavel.tsx
- Componentes que utilizam as rotas categories foram ajustados corretamente a simplificação feita.

## Reestilização do Header
> modified:   app/_components/header.tsx
> modified:   app/_components/ui/mobileSheets.tsx
- O Header passa a exibir outro layout quando é visto em telas mobile/tablet
- Correções do Layout do MobileSheets.tsx

# Resumo de Pequenas Atualizaçãoes Anteriores
- APIs estavam utilizam uma conexão direta com o Prisma, fazendo com que fosssem abertas diversas conexões com o banco de dados e ocasionando na limitação de abertura, onde causava a paralização após a 100ª requisição. A correção foi alterar para o arquivo lib/prisma.ts que gerencia e mantém aberta uma única conexão.
- Adição da paginação das tabelas, inicialmente de 10 em 10 linhas, e ordenação das colunas que atualmente podem ser organizadas por A-Z, Z-A ou 0-9, 9-0 para números e moedas. 
- Tabelas sem qualquer resultados foram inseridas e corrigidas para português.
- Adicionado os gráficos em pizza em escala de cinza para momentos onde não há transações inseridas pelo usuário. Junto a barras que simulariam dados a serem carregados. Tooltip é desativado quando não há dados.
- Correção nos tamanhos dos containers responsivos que estavam ocultando o valor das categorias.
- Adicionado a movimentação em meses e anos no dashboard. Limitando também a visão dos gráficos e tabelas ao mês selecionado.
- Implementação da lógica de fechamento do dialog das categorias.
- Correções do ESLint - Textos que utilização aspas.
- Correção da importação das importações do Embla.
- Simplificação de código do CarouselComponent.tsx
- Reinstalação (Update) do Chart.tsx (Shadcn/UI).
- Ajustes nas permissões do Prisma, para que consiga acessar em diferentes sites.
- Inserido comandos do build para o Vercel e Prisma. 
- APIs sendo forçadas a serem dynamic - 'force-dynamic'.
- Habilitação do serverActions e da output: 'standalone'.
- NextAuth foi atualizado para permitir conexões HTTPS e conseguir realizar suas ações dentro do mesmo site. E tornando o ENV_NODE como production. Feitas alterações também no middleware.ts.
- Compreendendo o caminho correto das rotas de APIs (Aqui resume-se diversos commits que realizavam testes com utilização do console e toast para compreender a nova estrutura do Vercel).
- Remoções de códigos e comentários desnessários.

        
        
	
	
	


	



	


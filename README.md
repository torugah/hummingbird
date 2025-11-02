# Mudanças

## Novidades
> modified:   app/cards/_components/cardsList.tsx
- Explicitamente alterado para Server Side e passa a receber props.
> modified:   app/cards/page.tsx
- Recebe props que são posteriormente enviadas ao CardList.
> modified:   app/api/categories/route.ts
- As categorias passam ser excluídas não mais físicamente (Soft Delete), onde agora sua exclusão passa a ser apenas uma alteração no booleando do status.
> modified:   app/_components/dialogDespesaVariavel.tsx
- Erros de obrigatoriedade agora estão em português.
- Parcelas adiante passam a ser "Em aberto" ao invés de "Futura".
- Campo das categorias agora verificam se há categorias da mesma espécie, evitando campos vazios ao encontrar categorias em geral.
- Campo dos cartões passam a oferecer a criação de novos cartões caso ainda não existam.
> modified:   app/desiresAndDecisions/_components/dialogAddNewWish.tsx
- Fechamento automático publicar novo desejo.

## Estética
> modified:   app/desiresAndDecisions/_components/wishList.tsx
- Implementação de área branca e ícone de etiqueta para evitar fundo vazio.
> modified:   app/dashboard/_components/alertCategoryLine.tsx
- Alteração de ícones utilizados

## Correções Textuais
> modified:   app/dashboard/_components/variableExpensesColumns.tsx
- Correção e verificação de texto exibido na tabela, de "EmAberto" para "Em Aberto". 
> modified:   app/categories/_components/dialogAddNewCategory.tsx
- Implementação de texto em português.
> modified:   app/cards/_components/dialogEditDeleteCard.tsx
- Correções textuais e fechamento automático ao editar/excluir cartões.
> modified:   app/cards/_components/dialogAddNewCard.tsx
- Implemtação de texto em português, recebeu abertura automática por parâmetros e fechamento automático publicar novo cartão.

## Limpeza
> modified:   app/_components/allMenuPages.tsx
> modified:   prisma/schema.prisma
- Remoção de Área Comentada. 
> modified:   next.config.mjs
- Remoção de área experimental "serverActions".




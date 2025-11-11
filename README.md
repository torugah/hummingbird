# Mudanças

## 1ª Parte da Implementação de Faturas
> modified:   app/cards/_components/dialogEditDeleteCard.tsx
> modified:   app/cards/_components/dialogAddNewCard.tsx
- Adicionado o "int_bestDate" ao validador do formulário, através do zod.
- Adicionado o valor padrão ao que é retornado pela API.
- Verificação de valor: Quando há alteração a antiga implementação da divisão por 100 é mantida, mas quando não houver alterações o valor segue o mesmo do que é trago pela API (Resolução de BUG).
- Adicionado o "int_bestDate" ao corpo da requisição.
- Divisão da linha de datas a fim da implementação da data de vencimento da fatura.
> modified:   app/cards/_components/cardsList.tsx
- Importações do ToolTip e novos ícones.
- Interface receber o novo elemento "int_bestDate".
- Utilização de negrito e aumento na fonte que exibe o nome do banco.
- Os números do cartão tiveram sua fonte aumentada, alterada para Monospace e maior distância de separação.
- Datas presentes nos cartões agora recebem Tooltips a fim de melhor explicar se são: Data de Vencimento da Fatura ou Data de Validade do Cartão.
- O Mouse ganha uma interroção ao passar pelas datas presentes.
> modified:   app/api/cards/route.ts
- Adicionado o "int_bestDate" a todas as rotas de API.

## Prisma 
> modified:   prisma/schema.prisma
> modified:   prisma/seed.mjs
> prisma/migrations/20251110215447_added_best_day_to_cards/
- Por uso de comando o Schema acabou sendo reorganizado, mas a única alteração é na adição da coluna "int_bestDate" na tabela Cartao.
- Logo foi feito uma nova _migration_ para registrar a mudança.
- As datas que compoêm o arquivo seed.mjs agora seguem a ISO-8601.

## Linguagem e Parcelamento
> modified:   app/dashboard/_components/dialogEditDespesaVariavel.tsx
> modified:   app/_components/dialogDespesaVariavel.tsx
- Recebeu pacote de palavras em português no calendário.
- Número de semanas passa a ser fixo.
- Capitalização dos meses
- Número de parcelas é fixado, ou corrigido, em 1 quando não é um parcelamento, categorizando como uma compra à vista corretamente. 

## Correção do Dialog
> modified:   app/desiresAndDecisions/_components/dialogEditDeleteWish.tsx
- Implementação do fechamento correto do _Dialog_ usado.

## Correções Pequenas
> modified:   app/passwordRecovery/page.tsx
- Remoção de código replicado (Apesar de não haver bugs).
> modified:   app/configurations/page.tsx
> modified:   app/categories/page.tsx
> modified:   app/cards/page.tsx
- Correção no tamanho ocupado.
> modified:   app/categories/_components/categoryCardList.tsx
- Correção no tamanho alinhado com outros _Cards_
# Mudanças
## Parcelamento no Dialog de Despesa Variável
> modified:   app/_components/dialogDespesaVariavel.tsx
- Importação do novo componente responsável pela exibição prévia de parcelamento.
- Refinamento do Schema: Impede que o usuário faça um parcelamento à vista.
- Nova interface para parcelamento.
- Remodelagem no trecho de envio/salvamento de nova transação para implementar verificação de parcelamento. Utiliza de multiplas requisições.
- O dialog recebeu limite máximo de altura junto a scrollbar devido a implementação da prévia de parcelamento.
- Inserido abaixo da linha de parcelamento o componente de prévia das parcelas.

## Correção para produção
> modified:   app/_lib/auth.ts
- Retorno dos cookies HTTPS

## Adicionado novo objeto para parcelas.
> modified:   app/api/transactions/route.ts
> modified:   app/calendar/_components/CalendarioCustomizado.tsx
> modified:   app/dashboard/_components/incomeRecipiesColumns.tsx
> modified:   app/calendar/page.tsx
- Alteração no schema.
> modified:   app/dashboard/_components/variableExpensesColumns.tsx
- Corrigido a visualização do número da parcela do item.

## Remoção de Logs
> modified:   app/dashboard/page.tsx
> modified: A LOT OF "console.log" too, not necessary to audit.

## Novo Componente de Card para prévia de parcelas.
> new file:   app/dashboard/_components/installmentHandler.tsx

## Prisma 
> new file:   prisma/migrations/20251002190846_add_current_installment_field migration.sql
> modified:   prisma/schema.prisma
- Necessário implementar nova coluna: "int_currentInstallment" que determina qual o número da parcela referente a linha/transação atual.
- Salvo também o arquivo de migração do Prisma.
## Novo Componente ShadCN/UI
> new file:   components/ui/badge.tsx


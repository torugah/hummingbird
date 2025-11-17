# Mudanças

## 2ª Parte da Implementação de Faturas
> added: app/api/transactions/creditTransactions/
- Nova rota de API especifica para consulta da fatura do cartão.
> added: app/dashboard/_components/cardStatusAlert.tsx 
- Novo Card que exibe os alertas de um cartão conforme informações sobre data de validade do cartão, limite de crédito do cartão e período de fatura. Implemntado dentro do componente dialogDespesaVariavel.tsx
> modified:   app/_components/dialogDespesaVariavel.tsx
- Importação do CardStatusAlert neste componente. Implementado na 5ª linha do formulário, após os campos de Cartão e Forma de Pagamento.
- Atualização da interface (regra de elementos) do Cartão
- Correção da estética dos textos

## Mudança Estética na página Calendar
> modified:   app/calendar/_components/CalendarWrapper.tsx
> modified:   app/calendar/_components/CalendarioCustomizado.tsx

## Correções
> modified:   app/cards/_components/dialogEditDeleteCard.tsx
- Propriedade _type_ movida corretamente para dentro do campo de dia de vencimento da fatura, anteriormente foi implementado erronêamente no campo de validade do cartão. 

## Limpeza de código
> modified:   app/categories/_components/categoryCardList.tsx
> modified:   app/categories/page.tsx
- Remoção de comentários
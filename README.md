# Mudanças

## Forma de Pagamento em Dinheiro
> modified:   app/_components/dialogDespesaVariavel.tsx
- Nova constante, chamada selectedPaymentMethodID que verifica a forma de pagamento selecionado.
- Uso do useEffect que obeserva a selectedPaymentMethodID e força que o cartão falso, que não é atrelado a um banco e retrata o dinheiro físico do usuário, seja selecionado e fixado quando o usuário seleciona a opção de pagamento por Dinheiro, e apenas desbloquia o campo dos cartões quando o usuário altera para outro método de pagamento. 
- O campo cardID, que trás os cartões do usuário recebeu filtros que exibem apenas cartões reais, com a exceção de quando o usuário opta por utilizar o método de pagamento em dinheiro ou então via boleto que pode ocasionar tanto o uso de um banco como a de dinheiro físico, ocasinando o aparecimento da opção "Dinheiro Pessoal" que se refere ao "cartão falso".
### Visualização Programada
> modified:   app/cards/_components/cardsList.tsx
> modified:   app/cards/_components/dialogAddNewCard.tsx
> modified:   app/cards/_components/dialogEditDeleteCard.tsx
- Ao ler os bancos que chegaram da API a aplicação irá fazer um filtro que exclui o cartão falso da visão do usuário. 
# Mudanças
## Neste Update
### Introdução de Nova Visualização
> Caminho: app/calendar
- Foi adicionado uma visualização mais geral do ano visualizado, tendo uma somatória das receitas, despesas fixas e variáveis e for fim um saldo para cada mês do ano.
## Retomando Update Anteriores, seguindo cada título:
### Correção na Listagem de Categorias
> app/_components/dialogDespesaVariavel
- Ao selecionar as categorias em uma nova transação ou na edição, será mostrado apenas as categorias que são coerentes com aquela nova transação.
### Alteração Visual e Pesquisa
> app/_components/dialogDespesaVariavel
> app/_components/dialogEditDespesaVariavel
- Implementação de Command.
- Ainda implementando a limitação de visualização das categorias.
### Correção Visual Sem Pesquisa
> app/_components/dialogDespesaVariavel
- Remoção do Command por não ofertar o que era esperado.
### Tabela de Ganhos e Paginação Melhorada
> app/dashboard/_components/dataTableVariableExpenses
- Implementação de Paginação e Ordenação 
> app/dashboard/_components/incomeRecipiesColumns
- O header das colunas recebe o ícone para ordenação.
### Testando Layout e Imagem de Perfil
> app/_components/ui/side-menu.tsx
- Ajuste para que o AvatarImage tenha um fallback para uma imagem genérica.
> app/categories/_components/categoryCardList
> app/categories/page
- Ajuste estético
### Ainda trabalhando no Layout
> app/_components/ui/side-menu.tsx
> app/categories/_components/categoryCardList
> app/categories/page
- Correção das alterações anteriores
### Correção na API Users
> app/_components/signUpForm.tsx
> app/api/user/editNickname
> app/api/user
> app/configurations
- Foi adicionado o "force-dynamic" nas APIs e o "NEXT_PUBLIC_SITE_URL" pra os funções FETCH que pertencem a usuário.
### Investigando a Rota Users
> app/api/user
- Adicionado alguns "console.log" e expecificando erros na API user a fim de compreender o problema com logins.
### Teste: Alterando Type Transaction e Gráfico Novo.
> app/dashboard
> app/dashboard/_components/variableExpensesColumns
> app/dashboard/_components/StackedAreaChart
> app/dashboard/_components/CarouselComponent
- Introdução ao novo gráfico de visualização de 3 e 6 últimos meses.
### Primeira Correção para Type Transactions
> app/dashboard/_components/incomeRecipiesColumns
- O atributo "str_categoryName" passa a não poder ser nulo.
### Corrigindo data e valores do novo gráfico
> app/dashboard/_components/StackedAreaChart
- Este componente passa a receber uma data do componente pai através das props.
- Alterados alguns métodos e atributos a fim de corrigir o que e aonde utilizar cada atributo das transactions recebidas.
> app/dashboard/page
- Agora passa a data atual para o componente do novo gráfico.
### Correções de 1 á 12
> app/dashboard/_components/page
>  app/dashboard/_components/StackedAreaChart
> app/dashboard/_components/CarouselComponent
- Em resumo: foi necessário reavaliar o código, aonde algumas funções estavam enfrentando problemas com datas - onde o servidor salva em UTC e a aplicação estava manipulando tudo no horário de brasília, o que permitia que alguns meses fossem ignorados e entre outros problemas que não permitiam a visualização correta do novo gráfico. 
### Gráfico Funcionando e Outros Testes
> app/api/transactions/route
- Adicionado uma forma mais específica de procurar as transações entre duas datas.
> app/dashboard/page
- Adicionado novo fetch que permite a pesquisa entre duas datas.
- Corrigido a sequência dos gráficos.
### Correções e Validações
> app/api/transactions/route
- Validação dos types das transações
> app/dashboard/page
- Corrigido a URL que utiliza a API das transações mais específicas.
### Melhor Estética
- Diversos arquivos tiveram a alteração de incluir/corrigir as APIs e fetchs.
- Alguns alterações nos cards e outras partes.

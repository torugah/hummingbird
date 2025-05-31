# Mudanças
## Menu de Páginas
> modified:   app/_components/allMenuPages.tsx
- Adicionado o botão de caminho para a página de Desejos e Decisões.
## Dialog de Despesas
> modified:   app/_components/dialogDespesaVariavel.tsx
- Boolean de parcelamento se torna opcional para atender ao dialog de receita.
- Adicionado a constante que armagena qual o tipo de transação
- Corpo da requisição agora implementa a constante do tipo de transação ao invés de valor fixo.
- Títulos alteram dinâmicamente de acordo com o tipo de transação.
- Quarta linha, de parcelas, é vísivel apenas para transações do tipo output.
- Remoção de comentário TODO.
## Cabeçalho
> modified:   app/_components/header.tsx
- Correção de link do calendário.
## Formulário de SignIn
> modified:   app/_components/signInForm.tsx
- Implementação do botão e função 'Lembre de mim' dentro do formulário.
- Importação do toast.
- Correção de textos.
## Lembre-se de mim
> modified:   app/_lib/auth.ts
- Implementado sistema de guardar cookies de login do usuário
- O cookie de login é armazenado pelo padrão de 30 dias.
- E caso o usuário prefira não selecionar essa opção, seu cookie dura apenas naquela sessão.
## Visibilidade de Linha
> modified:   app/dashboard/_components/dialogEditDespesaVariavel.tsx
- A quarta linha deste dialog só é visível se for um tipo de Output.
## Tipo de Transação
> modified:   app/dashboard/_components/variableExpensesColumns.tsx
- Agora este componente adiciona o tipo de transação no type Transaction.
- Alteração no nome para que se diferencie de componente similar (incomeRecipiesColumns.tsx).
## Página Inicial
> modified:   app/dashboard/page.tsx
- Correção das importações.
- Remoção completa das invoices, dados mockados que serviam apenas para testes, e da última tabela falsa, esta simulava a tabela de receitas (inputs).
- A chamada de DialogDVP agora adicionavam o tipo de transação as suas props.
- Criação da chamada da API para transações do tipo Income (Input).
## Realocação do Calenário
> deleted/moved:    app/timeVision/_components/CalendarioCustomizado.tsx
> deleted/moved:    app/timeVision/_components/ListaEventos.tsx
> deleted/moved:    app/timeVision/_components/customCalendar.module.css
> deleted/moved:    app/timeVision/page.tsx
> adedd:            app/calendar/
## Nova página
> app/desiresAndDecisions/
> app/dashboard/_components/incomeRecipiesColumns.tsx
## Comentários
> modified:   app/categories/page.tsx
> modified:   app/(home)
## Modificações de Configuração
> modified:   middleware.ts
- Adcionado a paǵina de desiresAndDecisions na supervisão do Next.Auth.
> modified:   next.config.mjs
- Permite que imagens do Github sejam acessadas.

        
        
        
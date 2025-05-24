# Mudanças
## Dialog das Despesas Variáveis
> app/_components/dialogDespesaVariavel.tsx
- Correção no nome do arquivo que antes tinha dois pontos antes de tsx.
- Limpeza de importações.
- Correções no FormSchema.
- Adicionado a interface para Categoria.
- Utilização de useRouter, mas que ainda precisa ser corrigido.
- Adição de constantes e useEffects que utilizam APIs para trazer informações e mostrar ao usuário, como suas categorias.
- Correções e implementações nos defaultValues, gerenciados pelo zod.
- Correções também no requestBody da API de Create.
- Grandes correções em FormControls unidos ( e então organizados separadamente. ), Calendar, Selects e NumericFormat a fim corrigir quebras de foco do RadixUI/Shadcn/UI, mas ainda é necessário nova revisão para resolução de outros pequenos bugs.
## Limpeza de comentários na rota
> app/api/categories/update/route.ts
## Reestruturação de APIs:
> Moved:    app/api/expenses/create/route.ts to app/api/transactions/create/route.ts
> Moved:    app/api/getTransactions/route.ts to app/api/transactions/getTransactions/route.ts
A fim de organização das rotas de API.
## Anotação
> modified:   app/cards/page.tsx
- Inserção de lembrete do conteúdo a ser criado.
## Remoção de Código Desnecessário
> app/categories/_components/dialogEditCategory.tsx
- Foi retirado as constantes responsáveis pelo abrir ou fechar da janela, tendo em vista que a página é atualizada assim que o usuário conclui a edição.
## Mudanças da variableExpensesColumns
> app/dashboard/_components/variableExpensesColumns.tsx
- Inserção dos últimos valores necessários no type Transaction.
- Forma de pagamento alterada para informar diretamente o nome da forma utilizada ao invés de valores definidos, que seguiam dado o ID informado.
- Grande implementação da ActionsCell, que é a coluna com ações de informação/descrição , edição e remoção de uma transação.
## Limpeza da Página Inicial
> app/dashboard/page.tsx
- Remoção de atualização de importações.
- Difenciação dos ID da invoices (Dados falsos para tabelas).
- Completa remoção da primeira tabela de indealização de despesas variáveis.
## Arquivos de configuração e versionamento
> modified:   package-lock.json
> modified:   package.json
## Implementações de Novas APIs
> app/api/transactions/
> app/api/transactions/delete
> app/api/transactions/getTransactions
> app/api/transactions/update
- Acima são as APIs que completam o CRUD da página de Transações.
## ActionsForColumns ou ActionsCell 
> app/dashboard/_components/actionsForColumns.tsx
- É a coluna com ações de informação/descrição , edição e remoção de uma transação.
## Edição de Transações
> app/dashboard/_components/dialogEditDespesaVariavel.tsx
- Componente responsável por mostrar um dialog ao usário editar uma transação.
## Importações novas e imagem definitiva do Usuário Test.
> components/ui/tooltip.tsx
> public/uploads/cmavoww810002d7gb6l2lmqhd.jpg


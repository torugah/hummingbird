# Mudanças
## Remoção da CategoryActions
> Caminho: app\categories\_components\CategoryActions.tsx
- Componente era utilizado pra agrupar outros dois componente que eram responsáveis pelo UPDATE e DELETE da categoria. O motivo da exclusão é que devido a complexidade de agrupar mais de um serviço a um único Dialog eram causados erros no Radix, responsável pela hieraquia das janelas/dialogs, que causava o congelamento de ações em toda a aplicação.
## Criação de API
> Caminho: app\api\categories\update\route.ts
- Criado a API responsável pela atualização de uma categoria.
## CategoryCardList
> Caminho: app\categories\_components\categoryCardList.tsx
- Remodelado a fim de encaixar nova estrutura de dialog
## Dialog de Nova Categoria
> Caminho: app\categories\_components\dialogAddNewCategory.tsx
- Adição de refinamento, responsável por não permitir que uma categoria tem limite de orçamento vazio.
- Ao ser utilizado e não houver falhas na API, o usuário que já era notificado por um toast, agora também é forçado a um refresh para confirmar de que uma nova categoria foi criada.
## Dialog de Edição e Remoção de Categoria
> Caminho: app\categories\_components\dialogEditCategory.tsx
- Este arquivo não havia sido salvo em atualizações anteriores, mas o mesmo era um dialog que apenas fazia a ação de atualizar uma categoria, porém com os problemas citados na CategoryActions foi necessário sua reformulação e integração com a ação de DELETE que estava presente em CategoryActions.

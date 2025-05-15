# Mudanças
## Página Inicial 
> Caminho: app/(home)/page.tsx
- Apenas algumas importações em desuso foram retiradas.
## Barra de Navegação
> Caminho: app\_components\allMenuPages.tsx
- Inserção do acesso a pagina de cartões.
## Card de Despesa Variável 
> Caminho: app\_components\dialogDespesaVariavel.tsx.
- página com remoção de constantes initulizados.
- Inserção de verificador de abertura e fechamento da janela.
- Remoção de código de teste. 
## Cabeçalho 
> Caminho: app\_components\header.tsx.
- Mudança leve na estilização. 
## Formulário de SignIn 
> Caminho: app\_components\signInForm.tsx.
- Correção de texto dos botões. 
- Remoção de comentários em console.
## Criação das API
> Caminho: app\api\categories\...
- Foram adicionados as funções de create, delete e getByUserId
## Criação da página de cartões
> Caminho: app\cards
## Alterações da página de categorias
> Caminho: app\categories
- Renderização corrigida para 'use server'.
- Componente se torna async, recebe e armazena informações da sessão que são enviados aos componentes filhos.
- Trecho de código teste foi removido.
- Componente filho CategoryCardList adicionado.
## Criação dos componentes filhos da página de Categoria
> Caminho: app\categories\_components\...
- categoryCardList: Componente responsavél pela renderização dos cards.
- dialogAddNewCategory: Componente que adiciona um card de inserção de novas categorias.
- categoryActions: Componente que realiza as ações de edit e delete de uma categoria.
## Limpeza da Dashboard
> Caminho: app\dashboard
- Limpeza de console.logs e JSON de testes da tabela.
## Instalações do Shadcn/UI:
> Caminho: components\ui
- Adicionado o alert-dialog.tsx
- Alterações no componente do button.tsx
## Modificações do Utils.ts
> Caminho: lib\utils.ts
- Inserida a função de formatação de valores em moeda brasileira.
### Limpeza de Código
> Caminhos: app\home, app\_components\side-menu.tsx e app\_components\sheets.tsx
- (home) e sheets com revisão e remoção de importações inutilizado.
- side-menu com remoção de código inutilizado.
### Arquivos de Configuração 
- package.json e package-lock.json com diversos updates e adições.
#### Imagens de Teste inseridas em public
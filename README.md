# Mudanças
## Middleware 
> modified:   middleware.ts
- Inserido o caminho da página '/cards' a fim de que também seja protegido pelo NextAuth e não permita que a página seja acessada sem que o usuário esteja logado em uma conta.
## Configurações do Next
> modified:   next.config.mjs
- Incluido código que permite que imagens do 'github.com' sejam autorizadas e acessadas pela aplicação.
## Alteração da Rota de API
> deleted:    app/api/getUserCards/route.tsx
- Movido para o caminho abaixo:
> moved:	app/api/cards/route.ts
- Este único arquivo é capaz de realizar POST, GET, PUT e DELETE.
## Página de Cartões
> modified:   app/cards/page.tsx
- Incluído importações de sessão e NextAuth.
- Componente modificado para exportar e torna-se assíncrono.
- Alterações em textos e estilização.
- Adicionado o componente CardsList.
## Novos Componentes para a Paǵinas de Cartões
> app/cards/_components/
> app/cards/_components/dialogAddNewCard.tsx
> app/cards/_components/dialogEditDeleteCard.tsx
- Componentes de CRUD para cartões.
## Pequenas Correções
> modified: app/(home)/page.tsx
- Alterado o tamanho da altura do componente que abriga Login, SignIn e SignUp da paǵina, de forma a se encaixar conforme a demanda de espaço dos seus componentes internos.
> modified:   app/_components/allMenuPages.tsx
- Os botões também foram corrigidos e agora preenchem todo o espaço.
> modified:   app/_components/dialogDespesaVariavel.tsx
- Correção da URL utilizada no fetch GET de cartões. 
- Remoção de comentários de orientação.
> modified:   app/_components/signInForm.tsx
- Remoção de Console.log() de verificação.
> modified:   app/dashboard/_components/dialogEditDespesaVariavel.tsx
- Correção da rota de API, adicionando GET. 
- Remoção de comentários
### Prisma ORM
> modified:   prisma/schema.prisma
> added: prisma/migrations/20250526225020_fix_cartao_model/
- Correção em Cartões, aonde str_transaction_id deixou de ser obrigatório, que causava problemas na adição de um novo Cartão sem transações.
## Arquivos de configuração e versionamento
> modified:   package-lock.json
> modified:   package.json


	
	
	


	



	


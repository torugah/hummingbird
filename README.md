# Mudanças
## Implmentação Visual dos Limites do Orçamento
> modified: app/dashboard/page.tsx
- Importação e aplicação do componente AlertCategoryLine.tsx
> modified: app/dashboard/_components/alertCategoryLine.tsx
- Componente responsável por ler as categorias do usuário e informa-lo caso suas compras tenha ultrapassado o limite informado pelo mesmo. 
## Correção Definitiva em NextAuth
> modified:   app/_lib/auth.ts
- Além da correção do caminho para /dashboard no siginin do componente GoogleSigninButton.tsx, também houve a necessidade de alternar o nome do cookie utilizado, pois a implementação de "__Secure-" é permitida apenas em HTTPS, ou seja, já em produção e em desenvolvimento é necessário remover este trecho afim de utilizar HTTP, lax e outras configurações que funcionam somente no ambiente de desenvolvimento.

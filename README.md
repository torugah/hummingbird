# Mudanças
## API das Tabelas
> modified:   app/dashboard/page.tsx
- Foi necessário a introdução de props nas APIs para diferenciar que elas traziam, afim de popular cada tabela.
- Utilização de duas API similares: Fixed e Variable
- Remoção de mais uma tabela Mocked/False, Fixed.
## Ajuste na estilização
> modified:   app/_components/footer.tsx
- Mudanças no comportamento de tamanho e lugar do componente
- Ajuste na visibilidade das letras.
## Link com Recuperação de Senha
> modified:   app/_components/signInForm.tsx
- Importação do Next Link
- O paragráfo 'Forgot your password?' agora leva o usuário para a página de recuperação de senha.
## Ajuste de API 
> modified:   app/api/transactions/getTransactions/route.ts
- A API das transactions, em seu GET, foi alterada para receber props que mudam o comportamento de filtro de busca.
## Alteração de Estilização Baseada em Props
> modified:   app/_components/dialogDespesaVariavel.tsx
- Modificação de textos e de configurações baseando-se no tipo de despesa.
## Estilização Alterada
> modified:   app/dashboard/_components/actionsForColumns.tsx
- Tooltip com cores corrigidas.
## Nova Página
> added:   app/passwordRecovery/
- Nova página estilizada para recuperação de senha.
- Esta página é apenas uma visualização, tendo em vista que o projeto não tem condições de abrir um servidor de e-mail, cujo é necessário para disparar um e-mail de recuperação de senha (E confirmar de que tal email é mesmo do usuário que solicitou).
## Outras adições:
> public/img/
- Removida em breve.

# Mudanças
## Nova Página: Desejos e Decições 
> modified: app/desiresAndDecisions/page.tsx
- Adicionado a última grande paǵina planejada deste projeto. Aqui lhe é apresentado uma página que te ajuda a anotar desejos e planeja-los corretamente a fim de que você sempre tenha seus desejos de forma controlada e sem atralhapar seu vida financeira.
## Componentes da página de Desejos e Decições
> app/desiresAndDecisions/_components/...[TUDO]
- São os componentes: Ação das Colunas, Tabela das Decisões, Colunas de Decição, Lista de Desejos (Servidor), Adição de Nova Decisão, Adição de Novo Desejo, Diálogo de Edição e Remoção de Desejos, Diáogo da Edição de Imagem, Lista de Desejos
## Carregamento de Decisões:
> added: lib/desiresService.ts
- Serviço que faz a busca das decições do usuário. 
## CSS Global
> modified:   app/globals.css
- Inserido estilizações para scrollbars.
## Melhor indicativo em SignIn
> modified:   app/_components/signInForm.tsx
- O toast do SignIn agora especifica melhor o que o usuário está errado: Email ou Senha.
## Autorização Detalhada
> modified:   app/_lib/auth.ts
- O console interno da aplicação também informa um log de verificação do SignIn.
## Novas APIs com CRUD
> app/api/decisions/ , app/api/desires/
- APIs com Create, Read, Update e Delete dos desejos e decisões.
## Mudança de Pastas: Especificação de Rota
> added: app/api/uploadAvatarImage/
> deleted: app/api/uploadImage/route.tsx
- Apenas indicando textualmente com o que a rota trabalha.
## Novo Design do Calendar!
> modified:   app/calendar/page.tsx
> modified:   app/calendar/_components/CalendarioCustomizado.tsx
> modified:   app/calendar/_components/ListaEventos.tsx
> modified:   app/calendar/_components/customCalendar.module.css
- A página de calendário foi reformulada e deve seguinte com novas atualização na sua funcionalidade em breve. Seus componentes também sofreram grandes transformações a fim de entregar novos visuais e funcionalidades.
## Mudanças no Prisma e seu Esquema
> modified:   prisma/schema.prisma
> added: prisma/migrations/20250610220954_desejos_e_decisoes_alterados/
- Correção importante em DecisaoDeCompra.
## Versionamento de Pacotes
> modified:   package-lock.json, package.json
## Limpeza de Código ou Pequenas Alterações
> modified:   app/api/cards/route.ts
- Remoção de importações e espaços vazios.
> modified:   app/categories/_components/categoryCardList.tsx
> modified:   app/configurations/page.tsx
> modified:   app/dashboard/_components/dialogEditDespesaVariavel.tsx
> added: components/ui/slider.tsx
- Adicionado o componente de slider ao projeto.

        
        
	
	
	


	



	


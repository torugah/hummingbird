# Mudanças do Commit (Finalizado a Idealização do Calendário)
## Componente CalendarioCustomizado
> Caminho: app/timeVision/_components\CalendarioCustomizado.tsx
- Adicção de alguns dados mockados para teste.
- Atualização do tamanho fixo do calendário.
- Calendário agora se move para outro mês se o dia for de outro mês.
- E outras modiificações por menores no desing.
## Componente ListaEventos
> Caminho: app/timeVision/_components\ListaEventos.tsx
- Adicionado pela primeira vez.
- Este componente mostra uma lista de eventos que foram armazenados no dia informado pelo calendário
## Módulo CSS do CalendárioCustomizado
> Caminho: app/timeVision/_components/customCalendar.module.css
- Adicionado pela primeira.
- Ainda deverá ser revisado e provamente retirado nos próximos updates.
## Página TimeVision
> app/timeVision/page.tsx
- Página recebeu as variáveis necessárias para receber e enviar as datas para ListaEventos por meio do Calendario Customizado

# Mudanças do Commit (Adcionado a busca por cartões do Usuário)
## Rota API - getPaymentMethod
> Caminho: app/api/getPaymentMethod/route.tsx
- Adicionado pela primeira vez.
- Este faz a busca pelas formas de pagamento inseridas no Banco de Dados
## Rota API - getUserCards
> Caminho: app/api/getUserCards/route.tsx
- Adicionado pela primeira vez.
- Este faz a busca pelos cartões do usuário atual da sessão.
## Componente CalendarioCustomizado
> Caminho: app/timeVision/_components\CalendarioCustomizado.tsx
- Recebeu uma lista mockada dos eventos, será removida posteriormente
## Componente ListaEventos
> Caminho: app/timeVision/_components\ListaEventos.tsx
- Pequenas mudanças na lista mockada.
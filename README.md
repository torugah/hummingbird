# Mudanças

## Grande mudança na página inicial
> modified:   app/dashboard/page.tsx 
- Adição de gráficos para uma mais rápida e melhor visualização.
- Adição da barra de resumo de gastos e valor restante.
- Adicionado a lógica necessária para obter data e calcular gastos
- Otimização literária das contantes e requisições de APIs.
- Adicionada interface pra o recebimento/modificação das datas.      
- Importações necessárias adicionadas.

## Componente de Mês/Ano
> app/_components/monthYearSelector.tsx
- Este componente foi criado para facilitar a seleção de um determinado mês em um determinado ano distante de forma mais simples.
- Além de fornecer uma estilização e funções básicas que determinação qual data o usuário está observante/modificando.

## Componentes de Carrosel
> app/dashboard/_components/CarouselComponent.tsx
> app/dashboard/_components/EmblaCarousel.tsx
> app/dashboard/_components/EmblaCarouselArrowButtons.tsx
> app/dashboard/_components/EmblaCarouselDotButton.tsx
- Aqui foi adicionado o carousel oferecido no site "https://www.embla-carousel.com/examples/predefined/#opacity", com modificações necessárias para a adpatação do projeto.

## Componente dos Gráficos
> app/dashboard/_components/resumeAllChart.tsx
- Componente que monta os gráficos em pizza, buscando e calculando dados a partir das despesas e receitas do usuário.

## Resumo de Valores
> app/dashboard/_components/valuesInfoBar.tsx
- Uma simples barra que mostra ao usuários informações como valor que será gasto, que já foi gasto, o valor restante após os gastos e também o VRC (Valor Real Calculado) que é o valor restante com o porém de que as despesas que ainda não foram pagas, ou seja, aquelas que são futura, são desconsideradas, com o fim de mostrar tanto o valor no final daquele mês como também o valor REAL no momento em que o usuário está observando.

## Cores em Gráficos
> modified:   app/globals.css
- Neste arquivos foi adicionado as predefinições das cores utilizadas nos gráficos

## Correção no Dialog da Despesa Variável
> modified:   app/_components/dialogDespesaVariavel.tsx
- Inserido "setIsOpen(false);" que determinava o fechamento do dialog após um submit.

## Alteração na API das transações
> modified:   app/api/transactions/getTransactions/route.ts
- Agora a API recebe a data, necessária para filtrar as transações.

## Ajuste BETA na estilização dos componentes
> modified:   app/categories/_components/categoryCardList.tsx
> modified:   app/categories/page.tsx
> modified:   app/desiresAndDecisions/_components/wishList.tsx
- CategoryCardList: Aqui foi feita uma estilização pra ajustar o tamanho dos cards de informação, mas ainda é experimental e precisa de mais alterações e validações.
- Categories/Page: Ajuste nos espaçamentos, também precisa ser validado em outras atualizações.
- WishList: Pequenas alterações visuais.

## Versionamento de Pacotes
> modified:   package-lock.json, package.json
## Limpeza de Código ou Pequenas Alterações
> app/dashboard/css/
> components/ui/carousel.tsx
> components/ui/chart.tsx

        
        
	
	
	


	



	


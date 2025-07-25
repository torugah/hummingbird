# Mudanças

## Correção da Sensação de Congelamento
> app/_components/signInForm.tsx
- Botão de Entrar agora só retorna a seu estado inicial se houver erros.
- Toast informa que o usuário foi conectado corretamente.

## Visibilidade de Categorias
> app/_components/dialogDespesaVariavel.tsx
- Adicionado str_movimentType na interface da Categoria
- Implementado um filtro que permite que a Dialog veja apenas o que lhe é proposto, explicando: Se é uma nova despesa, será mostrado categorias que estão com a str_movimentType como Output, e se for um ganho será mostrado aqueles que são Input.
- Corrigindo o espaçamento do Link/Texto de adicionar nova categoria.
        
	
	
	


	



	


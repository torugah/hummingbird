# Mudanças 
## Correções
> Caminhos: app\categories\_components\dialogAddNewCategory.tsx e app\api\categories\create
- Correções na verificação do Zod pra permitir que imagens não sejam necessárias na criação de uma categoria
## Prisma, Seeds e Supabase
- Tabela Categoria agora permite que coluna imagem seja.
- Seed carrega um usuário e cartão de teste e os tipos de pagamentos que estavam ausentes.
- Migração de atualização da seed e categoria
- Prisma, por meio da .env, agora aponta para um servidor na nuvem da Supabase.

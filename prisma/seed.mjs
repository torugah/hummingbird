import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const bancos = [
    { str_bankName: 'Itaú Unibanco', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/652%20-%20itau.png?raw=true', bool_active: true },
    { str_bankName: 'Banco do Brasil', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/001%20-%20banco%20do%20brasil.png?raw=true', bool_active: true },
    { str_bankName: 'Bradesco', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/036%20-%20bradesco.png?raw=true', bool_active: true },
    { str_bankName: 'Santander', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/033%20-%20santander.png?raw=true', bool_active: true },
    { str_bankName: 'Caixa Econômica Federal', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/104%20-%20caixa%20economica.png?raw=true', bool_active: true },
    { str_bankName: 'BTG Pactual', str_image: 'https://play-lh.googleusercontent.com/A_CqheRGFZom2lnBdbW52b5ZquFfZIxRPCZCXONNAMSuI1at8lU8awOSw7k5xOYZ669Z', bool_active: true },
    { str_bankName: 'Banrisul', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/041%20-%20banrisul.png?raw=true', bool_active: true },
    { str_bankName: 'Banco Safra', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/074%20-%20safra.png?raw=true', bool_active: true },
    { str_bankName: 'Banco Votorantim', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/655%20-%20votorantim.png?raw=true', bool_active: true },
    { str_bankName: 'Banco do Nordeste', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/004%20-%20banco%20do%20nordeste.png?raw=true', bool_active: true },
    { str_bankName: 'Banco Inter', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/077%20-%20inter.png?raw=true', bool_active: true },
    { str_bankName: 'BMG', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/318%20-%20bmg.png?raw=true', bool_active: true },
    { str_bankName: 'Daycoval', str_image: 'https://play-lh.googleusercontent.com/uaDvaAZW8Ls995RWP6ER_F6P8MGCuHE8bmMSRApbakgQ_BJDcm-XJdiu1vXa8ZKO', bool_active: true },
    { str_bankName: 'C6 Bank', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/336%20-%20c6.png?raw=true', bool_active: true },
    { str_bankName: 'HSBC Brasil', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/269%20-%20hsbc.png?raw=true', bool_active: true },
    { str_bankName: 'Banco Pan', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/623%20-%20banco%20pan.png?raw=true', bool_active: true },
    { str_bankName: 'Banestes', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/021%20-%20banestes.png?raw=true', bool_active: true },
    { str_bankName: 'Nubank', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/260%20-%20nubank.png?raw=true', bool_active: true },
    { str_bankName: 'Sicredi', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/748%20-%20sicredi.png?raw=true', bool_active: true },
    { str_bankName: 'Banco Original', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/212%20-%20original.png?raw=true', bool_active: true },
    { str_bankName: 'Mercantil do Brasil', str_image: 'https://github.com/negronnie/bancosdobrasil/blob/master/64px/389%20-%20banco%20mercantil.png?raw=true', bool_active: true },
  ];

  const tiposPagamento = [
    { id: 1, str_nomeTipoPgto: 'Dinheiro', bool_active: true, str_descricao: 'Primeira Versão' },
    { id: 2, str_nomeTipoPgto: 'Cartão de Crédito', bool_active: true, str_descricao: 'Primeira Versão' },
    { id: 3, str_nomeTipoPgto: 'Cartão de Débito', bool_active: true, str_descricao: 'Primeira Versão' },
    { id: 4, str_nomeTipoPgto: 'Pix', bool_active: true, str_descricao: 'Primeira Versão' },
    { id: 5, str_nomeTipoPgto: 'Boleto', bool_active: true, str_descricao: 'Primeira Versão' },
    { id: 6, str_nomeTipoPgto: 'Transferência', bool_active: true, str_descricao: 'Primeira Versão' },
    { id: 7, str_nomeTipoPgto: 'Cheque', bool_active: false, str_descricao: 'Primeira Versão' },
  ];

  const users = [
    {
      id: 'cmavoww810002d7gb6l2lmqhd',
      name: 'User Test',
      password: '$2b$10$N90EOLrW6mlFCVJ.7Fdf1.4wuxnQ2VQFBuX9p0RYNF4GA8AM6.oBa',
      email: 'user@test.com',
    }
  ]

  const cartoes = [
    {
      card_id: 1,
      str_transaction_id: 0,
      str_bank_id: 11,
      dbl_creditLimit: 2850,
      dtm_dueDate: "2030-01-18T00:00:00.000Z",
      int_bestDate: 11,
      str_lastNumbers: "7414",
      dtm_createAt: "2024-10-23T16:23:09.598Z",
      dtm_updateAt: "2024-10-23T16:23:09.598Z",
      bool_active: true,
      str_user_id: "cmavoww810002d7gb6l2lmqhd"
    },
    {
      card_id: 2,
      str_transaction_id: 0,
      str_bank_id: 11,
      dbl_creditLimit: 3600,
      dtm_dueDate: "2026-01-05T00:00:00.000Z",
      int_bestDate: 5,
      str_lastNumbers: "1861",
      dtm_createAt: "2024-10-23T16:23:09.598Z",
      dtm_updateAt: "2024-10-23T16:23:09.598Z",
      bool_active: true,
      str_user_id: "cmavoww810002d7gb6l2lmqhd"
    }
  ]

  for (const banco of bancos) {
    await prisma.banco.create({ data: banco });
  }

  for (const tipo of tiposPagamento) {
    await prisma.tipoPagamento.create({ data: tipo });
  }

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  for (const cartao of cartoes) {
    await prisma.cartao.create({ data: cartao });
  }

  // console.log('Seed concluída com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

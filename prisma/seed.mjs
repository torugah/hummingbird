import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

  // Inserir os dados na tabela Banco
  for (const banco of bancos) {
    await prisma.banco.create({
      data: banco,
    });
  }

  console.log('Dados inseridos na tabela Banco!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

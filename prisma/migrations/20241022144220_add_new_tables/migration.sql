/*
  Warnings:

  - You are about to drop the column `str_card_id` on the `Banco` table. All the data in the column will be lost.
  - You are about to drop the column `account_id` on the `Cartao` table. All the data in the column will be lost.
  - You are about to drop the column `account_id` on the `Categoria` table. All the data in the column will be lost.
  - The primary key for the `Transacao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `account_id` on the `Transacao` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `Transacao` table. All the data in the column will be lost.
  - The `str_investimentType` column on the `Transacao` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `account_id` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `bool_active` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `dtm_createAt` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `dtm_updateAt` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `tokenType` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `sessions` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bool_active` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `dtm_updateAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `str_hashedPassword` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `str_profile_picture` on the `users` table. All the data in the column will be lost.
  - The primary key for the `verificationtokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Authenticator` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[provider,provider_account_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier,token]` on the table `verificationtokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `str_user_id` to the `Cartao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Categoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Transacao` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `str_transactionType` on the `Transacao` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `str_movimentType` on the `Transacao` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `accounts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `type` on table `accounts` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `sessions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `dtm_updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoInvestimento" AS ENUM ('Poupanca', 'TesouroDireto', 'Debentures', 'FundoDeAcoes', 'Acoes', 'AcoesPreferencias', 'AcoesOrdinarias', 'Futuros', 'FundoCambial', 'FundoDeDividaExterna', 'FundoDeVentureCapital', 'Cambio', 'PrecificacaoDeCarbono', 'Securitizacao', 'MoedasDigitaisCBDCs', 'InvestimentoEmArte', 'Imoveis', 'P2PLending', 'InvestimentoSocial', 'FundosLongAndShort', 'FundosDeInvestimentoImobiliario', 'FundoDeInvestimentoEmCadeiasAgroindustriais', 'LetrasDeCreditoDoAgronegocio', 'LetrasDeCreditoImobiliario', 'Criptomoedas', 'OpcoesBancarias', 'PrevidenciaPrivada', 'CertificadoDeDepositoBancario', 'CertificadosDeOperacoesEstruturadas', 'FundoDeIndiceETFs', 'StocksEOuAcoesInternacionais', 'Commodities', 'FundoMultimercado', 'Crowdfunding', 'LetraFinanceira', 'TitulosPublicos', 'BonusDeSubscricao', 'Derivativos', 'Outros');

-- DropForeignKey
ALTER TABLE "Authenticator" DROP CONSTRAINT "Authenticator_userId_fkey";

-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropIndex
DROP INDEX "accounts_account_id_key";

-- AlterTable
ALTER TABLE "Banco" DROP COLUMN "str_card_id";

-- AlterTable
ALTER TABLE "Cartao" DROP COLUMN "account_id",
ADD COLUMN     "str_user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Categoria" DROP COLUMN "account_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transacao" DROP CONSTRAINT "Transacao_pkey",
DROP COLUMN "account_id",
DROP COLUMN "transaction_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
DROP COLUMN "str_transactionType",
ADD COLUMN     "str_transactionType" "TipoTransacao" NOT NULL,
DROP COLUMN "str_movimentType",
ADD COLUMN     "str_movimentType" "TipoMovimento" NOT NULL,
DROP COLUMN "str_investimentType",
ADD COLUMN     "str_investimentType" "TipoInvestimento",
ADD CONSTRAINT "Transacao_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_pkey",
DROP COLUMN "account_id",
DROP COLUMN "bool_active",
DROP COLUMN "dtm_createAt",
DROP COLUMN "dtm_updateAt",
DROP COLUMN "expiresAt",
DROP COLUMN "tokenType",
ADD COLUMN     "expires_at" INTEGER,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "token_type" TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "type" SET NOT NULL,
ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "bool_active",
DROP COLUMN "dtm_updateAt",
DROP COLUMN "str_hashedPassword",
DROP COLUMN "str_profile_picture",
ADD COLUMN     "dtm_updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "password" DROP NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AlterTable
ALTER TABLE "verificationtokens" DROP CONSTRAINT "verificationtokens_pkey";

-- DropTable
DROP TABLE "Authenticator";

-- CreateTable
CREATE TABLE "ListaDeDesejos" (
    "id" SERIAL NOT NULL,
    "str_user_id" TEXT NOT NULL,
    "str_wishName" TEXT NOT NULL,
    "str_wishDescription" TEXT,
    "dbl_wishValue" DOUBLE PRECISION NOT NULL,
    "str_image" TEXT,
    "dtm_createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtm_updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListaDeDesejos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesicaoDeCompra" (
    "id" SERIAL NOT NULL,
    "str_user_id" TEXT NOT NULL,
    "int_category_id" INTEGER NOT NULL,
    "int_wishList_id" INTEGER,
    "str_brand" TEXT,
    "str_descriptionOrLink" TEXT,
    "bool_doIHaveMoney" BOOLEAN NOT NULL,
    "bool_doIReallyNeed" BOOLEAN NOT NULL,
    "bool_doIPlanned" BOOLEAN NOT NULL,
    "dtm_createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtm_updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesicaoDeCompra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_str_category_id_fkey" FOREIGN KEY ("str_category_id") REFERENCES "Categoria"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_str_card_id_fkey" FOREIGN KEY ("str_card_id") REFERENCES "Cartao"("card_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cartao" ADD CONSTRAINT "Cartao_str_bank_id_fkey" FOREIGN KEY ("str_bank_id") REFERENCES "Banco"("bank_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cartao" ADD CONSTRAINT "Cartao_str_user_id_fkey" FOREIGN KEY ("str_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListaDeDesejos" ADD CONSTRAINT "ListaDeDesejos_str_user_id_fkey" FOREIGN KEY ("str_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesicaoDeCompra" ADD CONSTRAINT "DesicaoDeCompra_str_user_id_fkey" FOREIGN KEY ("str_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesicaoDeCompra" ADD CONSTRAINT "DesicaoDeCompra_int_category_id_fkey" FOREIGN KEY ("int_category_id") REFERENCES "Categoria"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesicaoDeCompra" ADD CONSTRAINT "DesicaoDeCompra_int_wishList_id_fkey" FOREIGN KEY ("int_wishList_id") REFERENCES "ListaDeDesejos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

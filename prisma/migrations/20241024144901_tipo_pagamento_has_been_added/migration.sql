/*
  Warnings:

  - You are about to drop the column `str_paymentForm` on the `Transacao` table. All the data in the column will be lost.
  - Added the required column `int_paymentForm` to the `Transacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transacao" DROP COLUMN "str_paymentForm",
ADD COLUMN     "int_paymentForm" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TipoPagamento" (
    "id" SERIAL NOT NULL,
    "str_nomeTipoPgto" TEXT NOT NULL,
    "dtm_createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dtm_updateAt" TIMESTAMP(3) NOT NULL,
    "bool_active" BOOLEAN NOT NULL,

    CONSTRAINT "TipoPagamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_int_paymentForm_fkey" FOREIGN KEY ("int_paymentForm") REFERENCES "TipoPagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

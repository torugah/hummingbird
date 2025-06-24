/*
  Warnings:

  - Added the required column `dbl_valor` to the `DesicaoDeCompra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `str_name` to the `DesicaoDeCompra` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DesicaoDeCompra" DROP CONSTRAINT "DesicaoDeCompra_int_category_id_fkey";

-- AlterTable
ALTER TABLE "DesicaoDeCompra" ADD COLUMN     "dbl_valor" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "str_name" TEXT NOT NULL,
ALTER COLUMN "int_category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DesicaoDeCompra" ADD CONSTRAINT "DesicaoDeCompra_int_category_id_fkey" FOREIGN KEY ("int_category_id") REFERENCES "Categoria"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

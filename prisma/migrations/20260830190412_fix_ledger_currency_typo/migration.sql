/*
  Warnings:

  - You are about to drop the column `currrency` on the `LedgerEntry` table. All the data in the column will be lost.
  - Added the required column `currency` to the `LedgerEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LedgerEntry" DROP COLUMN "currrency",
ADD COLUMN     "currency" TEXT NOT NULL;

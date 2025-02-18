/*
  Warnings:

  - You are about to drop the column `defaultAdress` on the `Address` table. All the data in the column will be lost.
  - Added the required column `defaultAddress` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromRemote` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "defaultAdress",
ADD COLUMN     "defaultAddress" BOOLEAN NOT NULL,
ADD COLUMN     "fromRemote" BOOLEAN NOT NULL;

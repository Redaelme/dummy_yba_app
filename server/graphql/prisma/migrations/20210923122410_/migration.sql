/*
  Warnings:

  - Added the required column `personNumber` to the `Shedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shedule" ADD COLUMN     "personNumber" INTEGER NOT NULL;

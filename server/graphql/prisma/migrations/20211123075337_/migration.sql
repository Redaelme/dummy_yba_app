/*
  Warnings:

  - Added the required column `updatedAt` to the `Shedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shedule" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

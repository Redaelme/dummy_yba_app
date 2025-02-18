/*
  Warnings:

  - Added the required column `updatedAt` to the `IncomingRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IncomingRequest" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
ALTER TABLE "IncomingMeetingRequest" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

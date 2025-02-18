/*
  Warnings:

  - Added the required column `GMT` to the `IncomingRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IncomingRequest" ADD COLUMN     "GMT" INTEGER NOT NULL;
ALTER TABLE "IncomingMeetingRequest" ADD COLUMN     "GMT" INTEGER NOT NULL;

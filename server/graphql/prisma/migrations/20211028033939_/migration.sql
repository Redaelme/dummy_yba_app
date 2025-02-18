-- AlterTable
ALTER TABLE "User" ADD COLUMN     "modeFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "beginModeFree" TIMESTAMP(3);

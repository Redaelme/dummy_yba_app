-- AlterTable
ALTER TABLE "IncomingRequest" ALTER COLUMN "updatedAt" DROP NOT NULL;
ALTER TABLE "IncomingMeetingRequest" ALTER COLUMN "updatedAt" DROP NOT NULL;

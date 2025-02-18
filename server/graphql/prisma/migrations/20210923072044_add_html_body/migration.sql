-- AlterTable
ALTER TABLE "IncomingRequest" ADD COLUMN     "htmlBody" TEXT NOT NULL DEFAULT E'';
ALTER TABLE "IncomingMeetingRequest" ADD COLUMN     "htmlBody" TEXT NOT NULL DEFAULT E'';

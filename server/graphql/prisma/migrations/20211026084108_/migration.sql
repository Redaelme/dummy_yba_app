-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EmailSubscription" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "IncomingRequest" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "IncomingMeetingRequest" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OAuth" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Preference" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Shedule" ALTER COLUMN "userId" DROP NOT NULL;

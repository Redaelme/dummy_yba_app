-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "TypeEnum" AS ENUM ('OUT', 'IN', 'BOOKING');

-- CreateEnum
CREATE TYPE "MailService" AS ENUM ('GOOGLE', 'MICROSOFT');

-- CreateEnum
CREATE TYPE "CalendarTypes" AS ENUM ('APPLE_CALENDAR', 'GOOGLE');

-- CreateEnum
CREATE TYPE "SheduleStatus" AS ENUM ('PENDING', 'ACCEPTED', 'POSTPONED', 'RESCHEDULING_PENDING', 'CANCELED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "lang" TEXT,
    "timezone" TEXT,
    "displayName" TEXT,
    "password" TEXT,
    "avatar" TEXT,
    "role" "RoleEnum" NOT NULL DEFAULT E'USER',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "isRemoved" BOOLEAN NOT NULL DEFAULT false,
    "mailService" "MailService" NOT NULL DEFAULT E'GOOGLE',
    "calendarType" "CalendarTypes" NOT NULL DEFAULT E'GOOGLE',
    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuth" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT,
    "refreshToken" TEXT,
    "tokenExpiryDateTime" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "oAuthOutlookAccountId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailSubscription" (
    "SubscriptionId" TEXT NOT NULL,
    "AccessToken" TEXT NOT NULL,
    "Resource" TEXT NOT NULL,
    "ChangeType" TEXT NOT NULL,
    "ClientState" TEXT NOT NULL,
    "NotificationUrl" TEXT NOT NULL,
    "SubscriptionExpirationDateTime" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("SubscriptionId")
);

-- CreateTable
CREATE TABLE "OAuthOutlookAccount" (
    "id" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "homeAccountId" TEXT NOT NULL,
    "localAccountId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "idTokenClaims" JSONB,
    "name" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shedule" (
    "id" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "debut" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "objet" TEXT NOT NULL,
    "sujet" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "localisation" TEXT NOT NULL,
    "userInvited" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "SheduleStatus" NOT NULL,
    "reservedSlot" TEXT NOT NULL,
    "acceptedSlot" TIMESTAMP(3),
    "creationDate" TEXT NOT NULL,
    "reservationExpirationDate" TEXT NOT NULL,
    "reminder" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "GMT" INTEGER NOT NULL,
    "eventId" TEXT,
    "messageId" TEXT,
    "addressId" TEXT,
    "lang" TEXT,
    "confirmedMessageId" TEXT,
    "usertoken" TEXT,
    "visioConf" BOOLEAN NOT NULL DEFAULT false,
    "type" "TypeEnum" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "isRemoved" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preference" (
    "id" TEXT NOT NULL,
    "workingDays" TEXT NOT NULL,
    "workingHoursBegin" TIMESTAMP(3) NOT NULL,
    "workingHoursEnd" TIMESTAMP(3) NOT NULL,
    "pauseHours" TEXT NOT NULL,
    "highCanRescheduleLow" BOOLEAN NOT NULL,
    "highCanRescheduleMedium" BOOLEAN NOT NULL,
    "highCanSkipPauseTimes" BOOLEAN NOT NULL,
    "highCanExtendWorkingTimes" BOOLEAN NOT NULL,
    "hightWorkingHoursBegin" TIMESTAMP(3) NOT NULL,
    "highWorkingHoursEnd" TIMESTAMP(3) NOT NULL,
    "mediumCanRescheduleLow" BOOLEAN NOT NULL,
    "mediumCanSkipPauseTimes" BOOLEAN NOT NULL,
    "mediumCanExtendWorkingHours" BOOLEAN NOT NULL,
    "mediumWorkingHoursBegin" TIMESTAMP(3) NOT NULL,
    "mediumWorkingHoursEnd" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "waitngResponseTimeForHIM" INTEGER NOT NULL,
    "waitngResponseTimeForMIM" INTEGER NOT NULL,
    "waitngResponseTimeForLIM" INTEGER NOT NULL,
    "averageTravelTime" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomingRequest" (
    "id" TEXT NOT NULL,
    "typeMail" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "recipients" TEXT NOT NULL,
    "object" TEXT NOT NULL,
    "senderFullName" TEXT NOT NULL,
    "contents" TEXT NOT NULL,
    "dateEntity" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "appointmentStatus" TEXT,
    "appointmentUserAction" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomingMeetingRequest" (
    "id" TEXT NOT NULL,
    "typeMail" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "recipients" TEXT NOT NULL,
    "object" TEXT NOT NULL,
    "senderFullName" TEXT NOT NULL,
    "contents" TEXT NOT NULL,
    "dateEntity" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL UNIQUE,
    "appointmentStatus" TEXT,
    "lang" TEXT,
    "appointmentUserAction" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OAuth.email_unique" ON "OAuth"("email");

-- AddForeignKey
ALTER TABLE "OAuth" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuth" ADD FOREIGN KEY ("oAuthOutlookAccountId") REFERENCES "OAuthOutlookAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailSubscription" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shedule" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preference" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingRequest" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IncomingMeetingRequest" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

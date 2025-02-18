-- CreateTable
CREATE TABLE "BookingLink"
(
    "id"                 TEXT         NOT NULL,
    "language"           TEXT,
    "duration"           INTEGER      NOT NULL,
    "expirationDuration" INTEGER      NOT NULL,
    "level"              TEXT         NOT NULL,
    "bookingTimes"       TEXT         NOT NULL,
    "userId"             TEXT         NOT NULL,
    "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

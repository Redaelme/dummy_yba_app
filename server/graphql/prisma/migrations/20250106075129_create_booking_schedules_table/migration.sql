-- CreateTable
CREATE TABLE "BookingSchedule"
(
    "id"           TEXT         NOT NULL,
    "language"     TEXT,
    "name"         TEXT,
    "email"        TEXT         NOT NULL,
    "participants" TEXT,
    "title"        TEXT         NOT NULL,
    "note"         TEXT,
    "rescheduleId" TEXT         NOT NULL,
    "scheduleId"   TEXT         NOT NULL,
    "link"         TEXT         NOT NULL,
    "duration"     INTEGER      NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("scheduleId") REFERENCES "Shedule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

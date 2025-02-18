CREATE TABLE "Task" (
                        "id" TEXT NOT NULL,
                        "duration" INTEGER NOT NULL,
                        "tag" TEXT,
                        "status" TEXT,
                        "notes" TEXT,
                        "timezone" TEXT,
                        "startTime" TEXT,
                        "endTime" TEXT,
                        "deadline" TIMESTAMP(3),
                        "title" TEXT NOT NULL,
                        "assignedTo" TEXT,
                        "endDate" TIMESTAMP(3),
                        "participants" JSONB,
                        "priority" TEXT,
                        "startDate" TIMESTAMP(3),
                        "parentTaskId" TEXT,
                        "userId" TEXT NOT NULL,
                        "scheduleId" TEXT,
                        "progress" INTEGER,
                        "updatedAt" TIMESTAMP(3) NOT NULL,
                        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        PRIMARY KEY ("id")
);
ALTER TABLE "Task" ADD FOREIGN KEY ("parentTaskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Task" ADD FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Task" ADD FOREIGN KEY ("scheduleId") REFERENCES "Shedule" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

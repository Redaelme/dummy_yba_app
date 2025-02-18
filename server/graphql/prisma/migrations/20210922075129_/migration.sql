-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "resourcesId" TEXT NOT NULL,
    "resourceName" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "generateResourceName" TEXT NOT NULL,
    "resourceEmail" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "resourceCategory" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Room" ADD FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Traffic" (
    "id" SERIAL NOT NULL,
    "Name" TEXT,
    "Zone" TEXT,
    "Tags" TEXT,
    "Device" TEXT,
    "dateTimeRange" TEXT,
    "peakHour" TEXT,
    "bandwidth" DOUBLE PRECISION,
    "maxTotalSpeed" DOUBLE PRECISION,
    "minTotalSpeed" DOUBLE PRECISION,
    "maxOutSpeed" DOUBLE PRECISION,
    "minOutSpeed" DOUBLE PRECISION,
    "maxInSpeed" DOUBLE PRECISION,
    "minInSpeed" DOUBLE PRECISION,
    "maxUtlization" DOUBLE PRECISION,
    "minUtlization" DOUBLE PRECISION,
    "averageMaxTotalSpeed" DOUBLE PRECISION,
    "averageMinTotalSpeed" DOUBLE PRECISION,
    "totalSpeedPercentage" DOUBLE PRECISION,
    "outSpeedPercentage" DOUBLE PRECISION,
    "inSpeedPercentage" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Traffic_pkey" PRIMARY KEY ("id")
);

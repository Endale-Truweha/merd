/*
  Warnings:

  - You are about to drop the column `Device` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `Tags` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `Zone` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `averageMaxTotalSpeed` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `averageMinTotalSpeed` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `inSpeedPercentage` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `maxInSpeed` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `maxOutSpeed` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `maxTotalSpeed` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `maxUtlization` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `minInSpeed` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `minOutSpeed` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `minTotalSpeed` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `minUtlization` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `outSpeedPercentage` on the `Traffic` table. All the data in the column will be lost.
  - You are about to drop the column `totalSpeedPercentage` on the `Traffic` table. All the data in the column will be lost.
  - You are about to alter the column `bandwidth` on the `Traffic` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `avgSpeed` to the `Traffic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device` to the `Traffic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxSpeed` to the `Traffic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxUtilization` to the `Traffic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minSpeed` to the `Traffic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minUtilization` to the `Traffic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Traffic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objid` to the `Traffic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `Traffic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zone` to the `Traffic` table without a default value. This is not possible if the table is not empty.
  - Made the column `dateTimeRange` on table `Traffic` required. This step will fail if there are existing NULL values in that column.
  - Made the column `peakHour` on table `Traffic` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bandwidth` on table `Traffic` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Traffic" DROP COLUMN "Device",
DROP COLUMN "Name",
DROP COLUMN "Tags",
DROP COLUMN "Zone",
DROP COLUMN "averageMaxTotalSpeed",
DROP COLUMN "averageMinTotalSpeed",
DROP COLUMN "inSpeedPercentage",
DROP COLUMN "maxInSpeed",
DROP COLUMN "maxOutSpeed",
DROP COLUMN "maxTotalSpeed",
DROP COLUMN "maxUtlization",
DROP COLUMN "minInSpeed",
DROP COLUMN "minOutSpeed",
DROP COLUMN "minTotalSpeed",
DROP COLUMN "minUtlization",
DROP COLUMN "outSpeedPercentage",
DROP COLUMN "totalSpeedPercentage",
ADD COLUMN     "avgSpeed" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "device" TEXT NOT NULL,
ADD COLUMN     "maxSpeed" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "maxUtilization" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "minSpeed" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "minUtilization" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "objid" INTEGER NOT NULL,
ADD COLUMN     "tags" TEXT NOT NULL,
ADD COLUMN     "zone" TEXT NOT NULL,
ALTER COLUMN "dateTimeRange" SET NOT NULL,
ALTER COLUMN "peakHour" SET NOT NULL,
ALTER COLUMN "bandwidth" SET NOT NULL,
ALTER COLUMN "bandwidth" SET DATA TYPE INTEGER;

/*
  Warnings:

  - A unique constraint covering the columns `[bookingNo]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceNo]` on the table `services` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingNo` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceNo` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "bookingNo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "serviceNo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingNo_key" ON "bookings"("bookingNo");

-- CreateIndex
CREATE UNIQUE INDEX "services_serviceNo_key" ON "services"("serviceNo");

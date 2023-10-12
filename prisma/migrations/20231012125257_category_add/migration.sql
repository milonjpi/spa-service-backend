/*
  Warnings:

  - Added the required column `category` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('male', 'female');

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "category" "ServiceCategory" NOT NULL;

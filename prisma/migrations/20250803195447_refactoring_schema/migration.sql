/*
  Warnings:

  - The `status` column on the `LeaveRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `locationTracking` on the `MissionRequest` table. All the data in the column will be lost.
  - You are about to drop the column `requestedAt` on the `MissionRequest` table. All the data in the column will be lost.
  - The `status` column on the `MissionRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `password` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `LeaveRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `clientName` to the `MissionRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `MissionRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MissionRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MANAGER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."LeaveType" AS ENUM ('ANNUAL', 'SICK', 'UNPAID', 'WORK_FROM_HOME');

-- DropForeignKey
ALTER TABLE "public"."AttendanceRecord" DROP CONSTRAINT "AttendanceRecord_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LeaveRequest" DROP CONSTRAINT "LeaveRequest_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MissionRequest" DROP CONSTRAINT "MissionRequest_employeeId_fkey";

-- AlterTable
ALTER TABLE "public"."Employee" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'EMPLOYEE';

-- AlterTable
ALTER TABLE "public"."LeaveRequest" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "public"."LeaveType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."MissionRequest" DROP COLUMN "locationTracking",
DROP COLUMN "requestedAt",
ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "trackLocation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."Settings" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "public"."RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_employeeId_idx" ON "public"."RefreshToken"("employeeId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_employeeId_idx" ON "public"."AttendanceRecord"("employeeId");

-- CreateIndex
CREATE INDEX "Employee_managerId_idx" ON "public"."Employee"("managerId");

-- CreateIndex
CREATE INDEX "LeaveRequest_employeeId_idx" ON "public"."LeaveRequest"("employeeId");

-- CreateIndex
CREATE INDEX "MissionRequest_employeeId_idx" ON "public"."MissionRequest"("employeeId");

-- AddForeignKey
ALTER TABLE "public"."MissionRequest" ADD CONSTRAINT "MissionRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaveRequest" ADD CONSTRAINT "LeaveRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

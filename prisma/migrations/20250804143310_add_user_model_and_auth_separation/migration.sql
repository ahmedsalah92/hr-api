/*
  Warnings:

  - You are about to drop the column `annualLeaveBalance` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `wfhDaysBalance` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `approvedAt` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `comments` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `approvedAt` on the `MissionRequest` table. All the data in the column will be lost.
  - You are about to drop the column `clientName` on the `MissionRequest` table. All the data in the column will be lost.
  - You are about to drop the column `comments` on the `MissionRequest` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `MissionRequest` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `MissionRequest` table. All the data in the column will be lost.
  - You are about to drop the column `trackLocation` on the `MissionRequest` table. All the data in the column will be lost.
  - The primary key for the `RefreshToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `employeeId` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the `AttendanceRecord` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endDate` to the `MissionRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `MissionRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AttendanceRecord" DROP CONSTRAINT "AttendanceRecord_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LeaveRequest" DROP CONSTRAINT "LeaveRequest_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MissionRequest" DROP CONSTRAINT "MissionRequest_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RefreshToken" DROP CONSTRAINT "RefreshToken_employeeId_fkey";

-- DropIndex
DROP INDEX "public"."Employee_managerId_idx";

-- DropIndex
DROP INDEX "public"."LeaveRequest_approvedById_idx";

-- DropIndex
DROP INDEX "public"."LeaveRequest_employeeId_idx";

-- DropIndex
DROP INDEX "public"."MissionRequest_approvedById_idx";

-- DropIndex
DROP INDEX "public"."MissionRequest_employeeId_idx";

-- DropIndex
DROP INDEX "public"."RefreshToken_employeeId_idx";

-- AlterTable
ALTER TABLE "public"."Employee" DROP COLUMN "annualLeaveBalance",
DROP COLUMN "password",
DROP COLUMN "role",
DROP COLUMN "wfhDaysBalance";

-- AlterTable
ALTER TABLE "public"."LeaveRequest" DROP COLUMN "approvedAt",
DROP COLUMN "comments",
ADD COLUMN     "reason" TEXT,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."MissionRequest" DROP COLUMN "approvedAt",
DROP COLUMN "clientName",
DROP COLUMN "comments",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "trackLocation",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "locationTrackingEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."RefreshToken" DROP CONSTRAINT "RefreshToken_pkey",
DROP COLUMN "employeeId",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "RefreshToken_id_seq";

-- DropTable
DROP TABLE "public"."AttendanceRecord";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkFromHome" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "approvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkFromHome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attendance" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OfficeExit" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "exitTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficeExit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "public"."User"("employeeId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MissionRequest" ADD CONSTRAINT "MissionRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaveRequest" ADD CONSTRAINT "LeaveRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkFromHome" ADD CONSTRAINT "WorkFromHome_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkFromHome" ADD CONSTRAINT "WorkFromHome_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OfficeExit" ADD CONSTRAINT "OfficeExit_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

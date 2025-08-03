-- AlterTable
ALTER TABLE "public"."Employee" ADD COLUMN     "annualLeaveBalance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wfhDaysBalance" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."LeaveRequest" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "comments" TEXT;

-- AlterTable
ALTER TABLE "public"."MissionRequest" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "comments" TEXT;

-- CreateIndex
CREATE INDEX "LeaveRequest_approvedById_idx" ON "public"."LeaveRequest"("approvedById");

-- CreateIndex
CREATE INDEX "MissionRequest_approvedById_idx" ON "public"."MissionRequest"("approvedById");

-- AddForeignKey
ALTER TABLE "public"."MissionRequest" ADD CONSTRAINT "MissionRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeaveRequest" ADD CONSTRAINT "LeaveRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

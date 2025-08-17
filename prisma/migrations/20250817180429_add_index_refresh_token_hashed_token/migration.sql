-- AlterTable
ALTER TABLE "public"."Employee" ADD COLUMN     "departmentId" TEXT,
ADD COLUMN     "displayName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "managerId" TEXT;

-- CreateIndex
CREATE INDEX "RefreshToken_hashedToken_idx" ON "public"."RefreshToken"("hashedToken");

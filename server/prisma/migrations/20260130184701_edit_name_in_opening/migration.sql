/*
  Warnings:

  - You are about to drop the column `resumeLoc` on the `JobApplication` table. All the data in the column will be lost.
  - Added the required column `resume` to the `JobApplication` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'SHORTLISTED', 'REJECTED', 'HIRED');

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "resumeLoc",
ADD COLUMN     "resume" TEXT NOT NULL,
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "JobApplication_jobId_idx" ON "JobApplication"("jobId");

-- CreateIndex
CREATE INDEX "JobApplication_email_idx" ON "JobApplication"("email");

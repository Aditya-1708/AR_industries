/*
  Warnings:

  - You are about to drop the column `userId` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `openings` on the `JobOpening` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `JobOpening` table. All the data in the column will be lost.
  - You are about to drop the column `application` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `keyFeatures` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `JobApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNo` to the `JobApplication` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'EDITOR', 'VIEWER');

-- DropForeignKey
ALTER TABLE "public"."JobApplication" DROP CONSTRAINT "JobApplication_jobId_fkey";

-- DropForeignKey
ALTER TABLE "public"."JobApplication" DROP CONSTRAINT "JobApplication_userId_fkey";

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "phoneNo" TEXT NOT NULL,
ADD COLUMN     "wswhy" TEXT;

-- AlterTable
ALTER TABLE "JobOpening" DROP COLUMN "openings",
DROP COLUMN "salary";

-- AlterTable
ALTER TABLE "Process" ADD COLUMN     "img" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "application",
DROP COLUMN "keyFeatures",
DROP COLUMN "material",
DROP COLUMN "price",
DROP COLUMN "stock",
ADD COLUMN     "type" TEXT;

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'EDITOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobOpening"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - The `requirements` column on the `JobOpening` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "JobOpening" ADD COLUMN     "salary" INTEGER,
DROP COLUMN "requirements",
ADD COLUMN     "requirements" TEXT[];

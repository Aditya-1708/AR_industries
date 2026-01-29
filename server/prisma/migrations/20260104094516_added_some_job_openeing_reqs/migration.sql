/*
  Warnings:

  - Added the required column `requirements` to the `JobOpening` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `JobOpening` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "JobOpening" ADD COLUMN     "requirements" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

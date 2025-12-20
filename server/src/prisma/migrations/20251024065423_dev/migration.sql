/*
  Warnings:

  - You are about to drop the column `location` on the `JobOpening` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."JobOpening" DROP COLUMN "location";

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "application" TEXT,
ADD COLUMN     "keyFeatures" TEXT[],
ADD COLUMN     "material" TEXT;

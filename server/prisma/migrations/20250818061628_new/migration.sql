/*
  Warnings:

  - You are about to drop the `ProcessOnProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ProcessOnProduct" DROP CONSTRAINT "ProcessOnProduct_processId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProcessOnProduct" DROP CONSTRAINT "ProcessOnProduct_productId_fkey";

-- DropTable
DROP TABLE "public"."ProcessOnProduct";

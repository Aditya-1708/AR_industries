-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "img" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Process" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProcessOnProduct" (
    "productId" INTEGER NOT NULL,
    "processId" INTEGER NOT NULL,

    CONSTRAINT "ProcessOnProduct_pkey" PRIMARY KEY ("productId","processId")
);

-- CreateTable
CREATE TABLE "public"."JobOpening" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "openings" INTEGER NOT NULL DEFAULT 1,
    "salary" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobOpening_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."ProcessOnProduct" ADD CONSTRAINT "ProcessOnProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProcessOnProduct" ADD CONSTRAINT "ProcessOnProduct_processId_fkey" FOREIGN KEY ("processId") REFERENCES "public"."Process"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

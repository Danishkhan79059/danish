/*
  Warnings:

  - You are about to drop the `Newslettersocial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contactform` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Newslettersocial";

-- DropTable
DROP TABLE "contactform";

-- CreateTable
CREATE TABLE "contactsubmission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contactsubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socialnew" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "socialnew_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contactsubmission_createdAt_idx" ON "contactsubmission"("createdAt");

-- CreateIndex
CREATE INDEX "contactsubmission_email_idx" ON "contactsubmission"("email");

-- CreateIndex
CREATE UNIQUE INDEX "socialnew_email_key" ON "socialnew"("email");

-- CreateIndex
CREATE INDEX "socialnew_email_idx" ON "socialnew"("email");

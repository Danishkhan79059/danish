-- CreateTable
CREATE TABLE "socialblog" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "featuredImage" TEXT NOT NULL DEFAULT '/aishiplogo.png',
    "author" TEXT NOT NULL DEFAULT 'AI Shyp Squad',
    "category" TEXT NOT NULL DEFAULT 'Logistics Automation',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "readingTime" TEXT NOT NULL DEFAULT '4 min read',
    "publishedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "socialblog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contactform" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contactform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newslettersocial" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newslettersocial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "socialblog_slug_key" ON "socialblog"("slug");

-- CreateIndex
CREATE INDEX "socialblog_category_idx" ON "socialblog"("category");

-- CreateIndex
CREATE INDEX "socialblog_createdAt_idx" ON "socialblog"("createdAt");

-- CreateIndex
CREATE INDEX "socialblog_isPublished_idx" ON "socialblog"("isPublished");

-- CreateIndex
CREATE INDEX "socialblog_publishedDate_idx" ON "socialblog"("publishedDate");

-- CreateIndex
CREATE INDEX "contactform_createdAt_idx" ON "contactform"("createdAt");

-- CreateIndex
CREATE INDEX "contactform_email_idx" ON "contactform"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Newslettersocial_email_key" ON "Newslettersocial"("email");

-- CreateIndex
CREATE INDEX "Newslettersocial_email_idx" ON "Newslettersocial"("email");

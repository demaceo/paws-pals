-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "dogName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "locale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Inquiry_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "Dog"("id") ON DELETE CASCADE
);

-- CreateIndex
CREATE INDEX "Inquiry_dogId_idx" ON "Inquiry"("dogId");

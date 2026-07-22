-- AlterTable
ALTER TABLE "Wish" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "wishId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Like_wishId_idx" ON "Like"("wishId");

-- CreateIndex
CREATE INDEX "Like_userId_idx" ON "Like"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_wishId_userId_key" ON "Like"("wishId", "userId");

-- CreateIndex
CREATE INDEX "Wish_published_idx" ON "Wish"("published");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_wishId_fkey" FOREIGN KEY ("wishId") REFERENCES "Wish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

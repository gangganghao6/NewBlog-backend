-- CreateTable
CREATE TABLE "BlogInfo" (
    "name" TEXT NOT NULL,
    "imageId" INTEGER NOT NULL,
    CONSTRAINT "BlogInfo_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogInfo_imageId_key" ON "BlogInfo"("imageId");

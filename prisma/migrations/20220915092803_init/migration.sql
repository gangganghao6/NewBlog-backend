/*
  Warnings:

  - You are about to drop the `BlogSimple` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `BlogSimpleId` on the `Image` table. All the data in the column will be lost.
  - Added the required column `BlogId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BlogSimple";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Blog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visited_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "pays_count" INTEGER NOT NULL DEFAULT 0
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "comment" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserId" INTEGER NOT NULL,
    "BlogId" INTEGER NOT NULL,
    CONSTRAINT "Comment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_BlogId_fkey" FOREIGN KEY ("BlogId") REFERENCES "Blog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("UserId", "comment", "created_time", "id") SELECT "UserId", "comment", "created_time", "id" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE UNIQUE INDEX "Comment_UserId_key" ON "Comment"("UserId");
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "VideoId" INTEGER,
    "BaseInfoId" INTEGER,
    "UserId" INTEGER,
    "BlogPostId" INTEGER,
    "BlogImagesId" INTEGER,
    CONSTRAINT "Image_VideoId_fkey" FOREIGN KEY ("VideoId") REFERENCES "Video" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BaseInfoId_fkey" FOREIGN KEY ("BaseInfoId") REFERENCES "BaseInfo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BlogPostId_fkey" FOREIGN KEY ("BlogPostId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BlogImagesId_fkey" FOREIGN KEY ("BlogImagesId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("BaseInfoId", "UserId", "VideoId", "created_time", "id", "name", "url") SELECT "BaseInfoId", "UserId", "VideoId", "created_time", "id", "name", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_VideoId_key" ON "Image"("VideoId");
CREATE UNIQUE INDEX "Image_BaseInfoId_key" ON "Image"("BaseInfoId");
CREATE UNIQUE INDEX "Image_UserId_key" ON "Image"("UserId");
CREATE UNIQUE INDEX "Image_BlogPostId_key" ON "Image"("BlogPostId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

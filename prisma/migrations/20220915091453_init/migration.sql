/*
  Warnings:

  - You are about to drop the column `imageId` on the `BlogSimple` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlogSimple" (
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
INSERT INTO "new_BlogSimple" ("comments_count", "content", "created_time", "id", "last_modified_time", "pays_count", "title", "type", "visited_count") SELECT "comments_count", "content", "created_time", "id", "last_modified_time", "pays_count", "title", "type", "visited_count" FROM "BlogSimple";
DROP TABLE "BlogSimple";
ALTER TABLE "new_BlogSimple" RENAME TO "BlogSimple";
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "VideoId" INTEGER,
    "BaseInfoId" INTEGER,
    "UserId" INTEGER,
    "BlogSimpleId" INTEGER,
    CONSTRAINT "Image_VideoId_fkey" FOREIGN KEY ("VideoId") REFERENCES "Video" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BaseInfoId_fkey" FOREIGN KEY ("BaseInfoId") REFERENCES "BaseInfo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BlogSimpleId_fkey" FOREIGN KEY ("BlogSimpleId") REFERENCES "BlogSimple" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("BaseInfoId", "UserId", "VideoId", "created_time", "id", "name", "url") SELECT "BaseInfoId", "UserId", "VideoId", "created_time", "id", "name", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_VideoId_key" ON "Image"("VideoId");
CREATE UNIQUE INDEX "Image_BaseInfoId_key" ON "Image"("BaseInfoId");
CREATE UNIQUE INDEX "Image_UserId_key" ON "Image"("UserId");
CREATE UNIQUE INDEX "Image_BlogSimpleId_key" ON "Image"("BlogSimpleId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

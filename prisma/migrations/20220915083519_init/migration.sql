/*
  Warnings:

  - Added the required column `blogs_count` to the `BlogInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comments_count` to the `BlogInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_modified_time` to the `BlogInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `BlogInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visits_count` to the `BlogInfo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlogInfo" (
    "name" TEXT NOT NULL,
    "imageId" INTEGER NOT NULL,
    "start_time" DATETIME NOT NULL,
    "blogs_count" INTEGER NOT NULL,
    "comments_count" INTEGER NOT NULL,
    "visits_count" INTEGER NOT NULL,
    "last_modified_time" DATETIME NOT NULL,
    CONSTRAINT "BlogInfo_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BlogInfo" ("imageId", "name") SELECT "imageId", "name" FROM "BlogInfo";
DROP TABLE "BlogInfo";
ALTER TABLE "new_BlogInfo" RENAME TO "BlogInfo";
CREATE UNIQUE INDEX "BlogInfo_imageId_key" ON "BlogInfo"("imageId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

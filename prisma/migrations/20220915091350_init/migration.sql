/*
  Warnings:

  - Added the required column `imageId` to the `BlogSimple` table without a default value. This is not possible if the table is not empty.

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
    "pays_count" INTEGER NOT NULL DEFAULT 0,
    "imageId" INTEGER NOT NULL,
    CONSTRAINT "BlogSimple_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BlogSimple" ("content", "created_time", "id", "last_modified_time", "title", "type", "visited_count") SELECT "content", "created_time", "id", "last_modified_time", "title", "type", "visited_count" FROM "BlogSimple";
DROP TABLE "BlogSimple";
ALTER TABLE "new_BlogSimple" RENAME TO "BlogSimple";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateTable
CREATE TABLE "BlogSimple" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visited_count" INTEGER NOT NULL DEFAULT 0
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlogInfo" (
    "name" TEXT NOT NULL DEFAULT 'undefined',
    "imageId" INTEGER NOT NULL,
    "start_time" DATETIME NOT NULL,
    "blogs_count" INTEGER NOT NULL,
    "comments_count" INTEGER NOT NULL,
    "visits_count" INTEGER NOT NULL,
    "last_modified_time" DATETIME NOT NULL,
    CONSTRAINT "BlogInfo_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BlogInfo" ("blogs_count", "comments_count", "imageId", "last_modified_time", "name", "start_time", "visits_count") SELECT "blogs_count", "comments_count", "imageId", "last_modified_time", "name", "start_time", "visits_count" FROM "BlogInfo";
DROP TABLE "BlogInfo";
ALTER TABLE "new_BlogInfo" RENAME TO "BlogInfo";
CREATE UNIQUE INDEX "BlogInfo_imageId_key" ON "BlogInfo"("imageId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

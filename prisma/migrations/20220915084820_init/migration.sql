-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "imageId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "is_subscribed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "User_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("created_time", "email", "id", "imageId", "is_banned", "is_subscribed", "name") SELECT "created_time", "email", "id", "imageId", "is_banned", "is_subscribed", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_imageId_key" ON "User"("imageId");
CREATE TABLE "new_BlogInfo" (
    "name" TEXT NOT NULL DEFAULT 'undefined',
    "imageId" INTEGER NOT NULL,
    "start_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blogs_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "visits_count" INTEGER NOT NULL DEFAULT 0,
    "last_modified_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlogInfo_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BlogInfo" ("blogs_count", "comments_count", "imageId", "last_modified_time", "name", "start_time", "visits_count") SELECT "blogs_count", "comments_count", "imageId", "last_modified_time", "name", "start_time", "visits_count" FROM "BlogInfo";
DROP TABLE "BlogInfo";
ALTER TABLE "new_BlogInfo" RENAME TO "BlogInfo";
CREATE UNIQUE INDEX "BlogInfo_imageId_key" ON "BlogInfo"("imageId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

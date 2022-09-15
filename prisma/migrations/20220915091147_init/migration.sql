/*
  Warnings:

  - You are about to drop the `BlogInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `userId` on the `UserVisit` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `Video` table. All the data in the column will be lost.
  - Added the required column `UserId` to the `UserVisit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BlogInfo_imageId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BlogInfo";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "BaseInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "start_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blogs_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "visits_count" INTEGER NOT NULL DEFAULT 0,
    "last_modified_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "VideoId" INTEGER,
    "BaseInfoId" INTEGER,
    "UserId" INTEGER,
    CONSTRAINT "Image_VideoId_fkey" FOREIGN KEY ("VideoId") REFERENCES "Video" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BaseInfoId_fkey" FOREIGN KEY ("BaseInfoId") REFERENCES "BaseInfo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("created_time", "id", "name", "url") SELECT "created_time", "id", "name", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_VideoId_key" ON "Image"("VideoId");
CREATE UNIQUE INDEX "Image_BaseInfoId_key" ON "Image"("BaseInfoId");
CREATE UNIQUE INDEX "Image_UserId_key" ON "Image"("UserId");
CREATE TABLE "new_UserVisit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ip" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "visit_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserId" INTEGER NOT NULL,
    CONSTRAINT "UserVisit_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserVisit" ("id", "ip", "user_agent", "visit_time") SELECT "id", "ip", "user_agent", "visit_time" FROM "UserVisit";
DROP TABLE "UserVisit";
ALTER TABLE "new_UserVisit" RENAME TO "UserVisit";
CREATE UNIQUE INDEX "UserVisit_UserId_key" ON "UserVisit"("UserId");
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "comment" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserId" INTEGER NOT NULL,
    CONSTRAINT "Comment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("comment", "created_time", "id") SELECT "comment", "created_time", "id" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE UNIQUE INDEX "Comment_UserId_key" ON "Comment"("UserId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "is_subscribed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("created_time", "email", "id", "is_banned", "is_subscribed", "name") SELECT "created_time", "email", "id", "is_banned", "is_subscribed", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Video" ("created_time", "id", "length", "name", "url") SELECT "created_time", "id", "length", "name", "url" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

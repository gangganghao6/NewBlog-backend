/*
  Warnings:

  - You are about to drop the column `ChatId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `ShuoshuoId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `ChatId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `BaseInfoId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `BlogPostId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `ChatId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `ProjectId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `VideoId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `Comment` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "PostId" INTEGER,
    CONSTRAINT "Video_PostId_fkey" FOREIGN KEY ("PostId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("created_time", "id", "length", "name", "url") SELECT "created_time", "id", "length", "name", "url" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
CREATE UNIQUE INDEX "Video_PostId_key" ON "Video"("PostId");
CREATE TABLE "new_File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_File" ("comments_count", "created_time", "download_count", "id", "name", "size", "type", "url") SELECT "comments_count", "created_time", "download_count", "id", "name", "size", "type", "url" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserId" INTEGER,
    "PostId" INTEGER,
    "ShuoshuoId" INTEGER,
    "BlogImagesId" INTEGER,
    CONSTRAINT "Image_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_PostId_fkey" FOREIGN KEY ("PostId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_ShuoshuoId_fkey" FOREIGN KEY ("ShuoshuoId") REFERENCES "Shuoshuo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BlogImagesId_fkey" FOREIGN KEY ("BlogImagesId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("BlogImagesId", "ShuoshuoId", "UserId", "created_time", "id", "name", "url") SELECT "BlogImagesId", "ShuoshuoId", "UserId", "created_time", "id", "name", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_UserId_key" ON "Image"("UserId");
CREATE UNIQUE INDEX "Image_PostId_key" ON "Image"("PostId");
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "duty" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "time_start" DATETIME NOT NULL,
    "time_end" DATETIME NOT NULL,
    "github_url" TEXT,
    "demo_url" TEXT,
    "ImageId" INTEGER,
    CONSTRAINT "Project_ImageId_fkey" FOREIGN KEY ("ImageId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("demo_url", "description", "duty", "github_url", "id", "name", "time_end", "time_start") SELECT "demo_url", "description", "duty", "github_url", "id", "name", "time_end", "time_start" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_ImageId_key" ON "Project"("ImageId");
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "comment" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserId" INTEGER NOT NULL,
    "BlogId" INTEGER,
    "FileId" INTEGER,
    "ShuoshuoId" INTEGER,
    CONSTRAINT "Comment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_BlogId_fkey" FOREIGN KEY ("BlogId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_FileId_fkey" FOREIGN KEY ("FileId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_ShuoshuoId_fkey" FOREIGN KEY ("ShuoshuoId") REFERENCES "Shuoshuo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("BlogId", "ShuoshuoId", "UserId", "comment", "created_time", "id") SELECT "BlogId", "ShuoshuoId", "UserId", "comment", "created_time", "id" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE UNIQUE INDEX "Comment_UserId_key" ON "Comment"("UserId");
CREATE TABLE "new_BaseInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blogs_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "visits_count" INTEGER NOT NULL DEFAULT 0,
    "last_modified_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "HeadImageId" INTEGER,
    CONSTRAINT "BaseInfo_HeadImageId_fkey" FOREIGN KEY ("HeadImageId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_BaseInfo" ("account", "blogs_count", "comments_count", "email", "id", "last_modified_time", "name", "password", "start_time", "visits_count") SELECT "account", "blogs_count", "comments_count", "email", "id", "last_modified_time", "name", "password", "start_time", "visits_count" FROM "BaseInfo";
DROP TABLE "BaseInfo";
ALTER TABLE "new_BaseInfo" RENAME TO "BaseInfo";
CREATE UNIQUE INDEX "BaseInfo_HeadImageId_key" ON "BaseInfo"("HeadImageId");
CREATE TABLE "new_Shuoshuo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "VideoId" INTEGER,
    "media_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visited_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Shuoshuo_VideoId_fkey" FOREIGN KEY ("VideoId") REFERENCES "Video" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Shuoshuo" ("comments_count", "content", "created_time", "id", "last_modified_time", "media_type", "visited_count") SELECT "comments_count", "content", "created_time", "id", "last_modified_time", "media_type", "visited_count" FROM "Shuoshuo";
DROP TABLE "Shuoshuo";
ALTER TABLE "new_Shuoshuo" RENAME TO "Shuoshuo";
CREATE UNIQUE INDEX "Shuoshuo_VideoId_key" ON "Shuoshuo"("VideoId");
CREATE TABLE "new_Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ip" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,
    "created_time" DATETIME NOT NULL,
    "content" TEXT NOT NULL,
    "ImageId" INTEGER,
    "VideoId" INTEGER,
    "FileId" INTEGER,
    "type" TEXT NOT NULL,
    CONSTRAINT "Chat_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chat_ImageId_fkey" FOREIGN KEY ("ImageId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Chat_VideoId_fkey" FOREIGN KEY ("VideoId") REFERENCES "Video" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Chat_FileId_fkey" FOREIGN KEY ("FileId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Chat" ("UserId", "content", "created_time", "id", "ip", "location", "type") SELECT "UserId", "content", "created_time", "id", "ip", "location", "type" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
CREATE UNIQUE INDEX "Chat_ImageId_key" ON "Chat"("ImageId");
CREATE UNIQUE INDEX "Chat_VideoId_key" ON "Chat"("VideoId");
CREATE UNIQUE INDEX "Chat_FileId_key" ON "Chat"("FileId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

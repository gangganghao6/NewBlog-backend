-- CreateTable
CREATE TABLE "Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ip" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,
    "created_time" DATETIME NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "Chat_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ChatId" INTEGER,
    CONSTRAINT "Video_ChatId_fkey" FOREIGN KEY ("ChatId") REFERENCES "Chat" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("created_time", "id", "length", "name", "url") SELECT "created_time", "id", "length", "name", "url" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
CREATE UNIQUE INDEX "Video_ChatId_key" ON "Video"("ChatId");
CREATE TABLE "new_File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "ChatId" INTEGER,
    CONSTRAINT "File_ChatId_fkey" FOREIGN KEY ("ChatId") REFERENCES "Chat" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_File" ("comments_count", "created_time", "download_count", "id", "name", "size", "type", "url") SELECT "comments_count", "created_time", "download_count", "id", "name", "size", "type", "url" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE UNIQUE INDEX "File_ChatId_key" ON "File"("ChatId");
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
    "ProjectId" INTEGER,
    "ChatId" INTEGER,
    CONSTRAINT "Image_VideoId_fkey" FOREIGN KEY ("VideoId") REFERENCES "Video" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BaseInfoId_fkey" FOREIGN KEY ("BaseInfoId") REFERENCES "BaseInfo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BlogPostId_fkey" FOREIGN KEY ("BlogPostId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BlogImagesId_fkey" FOREIGN KEY ("BlogImagesId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_ChatId_fkey" FOREIGN KEY ("ChatId") REFERENCES "Chat" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("BaseInfoId", "BlogImagesId", "BlogPostId", "ProjectId", "UserId", "VideoId", "created_time", "id", "name", "url") SELECT "BaseInfoId", "BlogImagesId", "BlogPostId", "ProjectId", "UserId", "VideoId", "created_time", "id", "name", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_VideoId_key" ON "Image"("VideoId");
CREATE UNIQUE INDEX "Image_BaseInfoId_key" ON "Image"("BaseInfoId");
CREATE UNIQUE INDEX "Image_UserId_key" ON "Image"("UserId");
CREATE UNIQUE INDEX "Image_BlogPostId_key" ON "Image"("BlogPostId");
CREATE UNIQUE INDEX "Image_ProjectId_key" ON "Image"("ProjectId");
CREATE UNIQUE INDEX "Image_ChatId_key" ON "Image"("ChatId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

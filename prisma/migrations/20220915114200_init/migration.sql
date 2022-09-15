-- CreateTable
CREATE TABLE "Shuoshuo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "media_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visited_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "comment" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserId" INTEGER NOT NULL,
    "BlogId" INTEGER,
    "fileId" INTEGER,
    "ShuoshuoId" INTEGER,
    CONSTRAINT "Comment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_BlogId_fkey" FOREIGN KEY ("BlogId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_ShuoshuoId_fkey" FOREIGN KEY ("ShuoshuoId") REFERENCES "Shuoshuo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("BlogId", "UserId", "comment", "created_time", "fileId", "id") SELECT "BlogId", "UserId", "comment", "created_time", "fileId", "id" FROM "Comment";
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
    "ProjectId" INTEGER,
    "ChatId" INTEGER,
    "ShuoshuoId" INTEGER,
    CONSTRAINT "Image_VideoId_fkey" FOREIGN KEY ("VideoId") REFERENCES "Video" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BaseInfoId_fkey" FOREIGN KEY ("BaseInfoId") REFERENCES "BaseInfo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BlogPostId_fkey" FOREIGN KEY ("BlogPostId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BlogImagesId_fkey" FOREIGN KEY ("BlogImagesId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_ChatId_fkey" FOREIGN KEY ("ChatId") REFERENCES "Chat" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_ShuoshuoId_fkey" FOREIGN KEY ("ShuoshuoId") REFERENCES "Shuoshuo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("BaseInfoId", "BlogImagesId", "BlogPostId", "ChatId", "ProjectId", "UserId", "VideoId", "created_time", "id", "name", "url") SELECT "BaseInfoId", "BlogImagesId", "BlogPostId", "ChatId", "ProjectId", "UserId", "VideoId", "created_time", "id", "name", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_VideoId_key" ON "Image"("VideoId");
CREATE UNIQUE INDEX "Image_BaseInfoId_key" ON "Image"("BaseInfoId");
CREATE UNIQUE INDEX "Image_UserId_key" ON "Image"("UserId");
CREATE UNIQUE INDEX "Image_BlogPostId_key" ON "Image"("BlogPostId");
CREATE UNIQUE INDEX "Image_ProjectId_key" ON "Image"("ProjectId");
CREATE UNIQUE INDEX "Image_ChatId_key" ON "Image"("ChatId");
CREATE TABLE "new_Video" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ChatId" INTEGER,
    "ShuoshuoId" INTEGER,
    CONSTRAINT "Video_ChatId_fkey" FOREIGN KEY ("ChatId") REFERENCES "Chat" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Video_ShuoshuoId_fkey" FOREIGN KEY ("ShuoshuoId") REFERENCES "Shuoshuo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("ChatId", "created_time", "id", "length", "name", "url") SELECT "ChatId", "created_time", "id", "length", "name", "url" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
CREATE UNIQUE INDEX "Video_ChatId_key" ON "Video"("ChatId");
CREATE UNIQUE INDEX "Video_ShuoshuoId_key" ON "Video"("ShuoshuoId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

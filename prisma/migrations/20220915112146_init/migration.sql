-- CreateTable
CREATE TABLE "Experience" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company" TEXT NOT NULL,
    "duty" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "time_start" DATETIME NOT NULL,
    "time_end" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "duty" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "time_start" DATETIME NOT NULL,
    "time_end" DATETIME NOT NULL,
    "github_url" TEXT,
    "demo_url" TEXT
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
    "BlogPostId" INTEGER,
    "BlogImagesId" INTEGER,
    "ProjectId" INTEGER,
    CONSTRAINT "Image_VideoId_fkey" FOREIGN KEY ("VideoId") REFERENCES "Video" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BaseInfoId_fkey" FOREIGN KEY ("BaseInfoId") REFERENCES "BaseInfo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BlogPostId_fkey" FOREIGN KEY ("BlogPostId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_BlogImagesId_fkey" FOREIGN KEY ("BlogImagesId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_ProjectId_fkey" FOREIGN KEY ("ProjectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("BaseInfoId", "BlogImagesId", "BlogPostId", "UserId", "VideoId", "created_time", "id", "name", "url") SELECT "BaseInfoId", "BlogImagesId", "BlogPostId", "UserId", "VideoId", "created_time", "id", "name", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_VideoId_key" ON "Image"("VideoId");
CREATE UNIQUE INDEX "Image_BaseInfoId_key" ON "Image"("BaseInfoId");
CREATE UNIQUE INDEX "Image_UserId_key" ON "Image"("UserId");
CREATE UNIQUE INDEX "Image_BlogPostId_key" ON "Image"("BlogPostId");
CREATE UNIQUE INDEX "Image_ProjectId_key" ON "Image"("ProjectId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

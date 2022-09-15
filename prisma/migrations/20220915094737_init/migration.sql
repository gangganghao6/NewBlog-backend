-- CreateTable
CREATE TABLE "Github" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "readme" TEXT NOT NULL,
    "page_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL,
    "last_modified_time" DATETIME NOT NULL,
    "languages" TEXT NOT NULL,
    "stars_count" INTEGER NOT NULL,
    "forks_count" INTEGER NOT NULL,
    "watchers_count" INTEGER NOT NULL
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
    CONSTRAINT "Comment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_BlogId_fkey" FOREIGN KEY ("BlogId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("BlogId", "UserId", "comment", "created_time", "fileId", "id") SELECT "BlogId", "UserId", "comment", "created_time", "fileId", "id" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE UNIQUE INDEX "Comment_UserId_key" ON "Comment"("UserId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

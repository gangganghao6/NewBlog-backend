/*
  Warnings:

  - Added the required column `account` to the `BaseInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `BaseInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `BaseInfo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BaseInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "start_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blogs_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "visits_count" INTEGER NOT NULL DEFAULT 0,
    "last_modified_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL
);
INSERT INTO "new_BaseInfo" ("blogs_count", "comments_count", "id", "last_modified_time", "name", "start_time", "visits_count") SELECT "blogs_count", "comments_count", "id", "last_modified_time", "name", "start_time", "visits_count" FROM "BaseInfo";
DROP TABLE "BaseInfo";
ALTER TABLE "new_BaseInfo" RENAME TO "BaseInfo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

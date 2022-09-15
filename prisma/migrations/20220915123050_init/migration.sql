/*
  Warnings:

  - Made the column `name` on table `BaseInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "email" TEXT NOT NULL
);
INSERT INTO "new_BaseInfo" ("account", "blogs_count", "comments_count", "email", "id", "last_modified_time", "name", "password", "start_time", "visits_count") SELECT "account", "blogs_count", "comments_count", "email", "id", "last_modified_time", "name", "password", "start_time", "visits_count" FROM "BaseInfo";
DROP TABLE "BaseInfo";
ALTER TABLE "new_BaseInfo" RENAME TO "BaseInfo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

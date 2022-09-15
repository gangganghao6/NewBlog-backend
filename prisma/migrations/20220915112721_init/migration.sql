/*
  Warnings:

  - Added the required column `type` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ip" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,
    "created_time" DATETIME NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Chat_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Chat" ("UserId", "content", "created_time", "id", "ip", "location") SELECT "UserId", "content", "created_time", "id", "ip", "location" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

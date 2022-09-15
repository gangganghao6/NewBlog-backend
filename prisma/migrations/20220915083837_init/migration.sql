/*
  Warnings:

  - Added the required column `created_time` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_banned` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_subscribed` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "imageId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL,
    "is_banned" BOOLEAN NOT NULL,
    "is_subscribed" BOOLEAN NOT NULL,
    CONSTRAINT "User_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("id") SELECT "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_imageId_key" ON "User"("imageId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

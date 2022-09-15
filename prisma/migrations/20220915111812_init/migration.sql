-- CreateTable
CREATE TABLE "Personal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "birthday" DATETIME NOT NULL,
    "wechat" TEXT NOT NULL,
    "qq" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "university_end_time" DATETIME NOT NULL,
    "home" TEXT NOT NULL,
    "readme" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Todolist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_done" BOOLEAN NOT NULL DEFAULT false,
    "is_done_time" DATETIME
);
INSERT INTO "new_Todolist" ("created_time", "id", "is_done", "is_done_time", "title") SELECT "created_time", "id", "is_done", "is_done_time", "title" FROM "Todolist";
DROP TABLE "Todolist";
ALTER TABLE "new_Todolist" RENAME TO "Todolist";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

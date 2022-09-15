-- CreateTable
CREATE TABLE "Pay" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "money" REAL NOT NULL DEFAULT 0.0,
    "order_id" TEXT NOT NULL,
    "order_url" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pay_success" BOOLEAN NOT NULL DEFAULT false,
    "is_close" BOOLEAN NOT NULL DEFAULT false,
    "pay_type" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,
    CONSTRAINT "Pay_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

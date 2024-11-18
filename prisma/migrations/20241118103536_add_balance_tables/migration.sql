-- CreateEnum
CREATE TYPE "Tokens" AS ENUM ('INGAME');

-- CreateTable
CREATE TABLE "user_token_balances" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" "Tokens" NOT NULL DEFAULT 'INGAME',
    "balance" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_token_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_token_balance_histories" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" "Tokens" NOT NULL DEFAULT 'INGAME',
    "from_balance" INTEGER NOT NULL,
    "to_balance" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_token_balance_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_token_balances_user_id_token_key" ON "user_token_balances"("user_id", "token");

-- CreateIndex
CREATE UNIQUE INDEX "user_token_balance_histories_user_id_token_created_at_key" ON "user_token_balance_histories"("user_id", "token", "created_at");

-- AddForeignKey
ALTER TABLE "user_token_balances" ADD CONSTRAINT "user_token_balances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_token_balance_histories" ADD CONSTRAINT "user_token_balance_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

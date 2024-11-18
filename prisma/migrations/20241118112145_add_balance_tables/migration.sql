-- AlterTable
ALTER TABLE "user_token_balance_histories" ADD COLUMN     "meta_data" JSONB,
ALTER COLUMN "from_balance" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "to_balance" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "user_token_balances" ALTER COLUMN "balance" SET DEFAULT 0.0,
ALTER COLUMN "balance" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "user_token_claim_infomations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" "Tokens" NOT NULL DEFAULT 'INGAME',
    "last_claim_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_token_claim_infomations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_token_claim_infomations_user_id_token_key" ON "user_token_claim_infomations"("user_id", "token");

-- AddForeignKey
ALTER TABLE "user_token_claim_infomations" ADD CONSTRAINT "user_token_claim_infomations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

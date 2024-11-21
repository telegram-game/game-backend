-- CreateTable
CREATE TABLE "user_referrals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "UserProvider" NOT NULL,
    "provider_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_referrals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_referrals_provider_provider_user_id_key" ON "user_referrals"("provider", "provider_user_id");

-- AddForeignKey
ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

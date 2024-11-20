-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED', 'ENOUGH_BUDGET');

-- CreateTable
CREATE TABLE "missions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "from_date" TIMESTAMP(3) NOT NULL,
    "to_date" TIMESTAMP(3) NOT NULL,
    "total_budget" INTEGER NOT NULL,
    "current_claimed" INTEGER NOT NULL,
    "status" "MissionStatus" NOT NULL DEFAULT 'ACTIVE',
    "meta_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_missions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "mission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_missions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "missions_code_key" ON "missions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_missions_user_id_mission_id_key" ON "user_missions"("user_id", "mission_id");

-- AddForeignKey
ALTER TABLE "user_missions" ADD CONSTRAINT "user_missions_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

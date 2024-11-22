-- CreateEnum
CREATE TYPE "SeasonStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED');

-- AlterTable
ALTER TABLE "game_seasons" ADD COLUMN     "status" "SeasonStatus" NOT NULL DEFAULT 'ACTIVE';

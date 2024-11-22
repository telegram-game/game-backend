import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { GameSeasons, SeasonStatus } from '@prisma/client';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserGameProfileGameSeasonRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async getByGameProfileAndSeasion(userId: string, gameProfileId: string, seasonId: string): Promise<GameSeasons> {
    return this.client.userGameProfileGameSeasons.findFirst({
      where: {
        status: SeasonStatus.ACTIVE,
      },
    })
  }
}

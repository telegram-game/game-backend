import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { GameSeasons, SeasonStatus } from '@prisma/client';

@Injectable({
  scope: Scope.REQUEST,
})
export class GameSeasonRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async getFirstActive(): Promise<GameSeasons> {
    return this.client.gameSeasons.findFirst({
      where: {
        status: SeasonStatus.ACTIVE,
      },
    });
  }
}

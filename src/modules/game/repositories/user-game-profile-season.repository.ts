import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { UserGameProfileGameSeasons } from '@prisma/client';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserGameProfileSeasonRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async getByGameProfileAndSeasion(
    userId: string,
    gameProfileId: string,
    seasonId: string,
  ): Promise<UserGameProfileGameSeasons> {
    return this.client.userGameProfileGameSeasons.findFirst({
      where: {
        userId,
        userGameProfileId: gameProfileId,
        seasonId,
      },
    });
  }

  async create(
    data: Partial<UserGameProfileGameSeasons>,
  ): Promise<UserGameProfileGameSeasons> {
    return this.client.userGameProfileGameSeasons.create({
      data: data as UserGameProfileGameSeasons,
    });
  }

  async update(
    data: Partial<UserGameProfileGameSeasons>,
  ): Promise<UserGameProfileGameSeasons> {
    return this.client.userGameProfileGameSeasons.update({
      where: {
        id: data.id,
        userId: data.userId,
        userGameProfileId: data.userGameProfileId,
        seasonId: data.seasonId,
      },
      data: data as UserGameProfileGameSeasons,
    });
  }
}

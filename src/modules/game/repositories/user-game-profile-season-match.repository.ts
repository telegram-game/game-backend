import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { UserGameProfileGameSeasonMatches } from '@prisma/client';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserGameProfileSeasonMatchRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async create(
    data: Partial<UserGameProfileGameSeasonMatches>,
  ): Promise<UserGameProfileGameSeasonMatches> {
    return this.client.userGameProfileGameSeasonMatches.create({
      data: data as UserGameProfileGameSeasonMatches,
    });
  }
}

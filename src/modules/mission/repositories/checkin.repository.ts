import { Injectable, Scope } from '@nestjs/common';
import { UserGameProfileDailyCheckins } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class CheckinRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async gets(userId: string, gameProfileId: string, options?: {
    limit?: number;
  }): Promise<UserGameProfileDailyCheckins[]> {
    return this.client.userGameProfileDailyCheckins.findMany({
      where: {
        userId,
        userGameProfileId: gameProfileId,
      },
      take: options?.limit,
      orderBy: {
        checkinCode: 'desc',
      }
    });
  }

  async create(
    data: Partial<UserGameProfileDailyCheckins>,
  ): Promise<UserGameProfileDailyCheckins> {
    return this.client.userGameProfileDailyCheckins.create({
      data: data as UserGameProfileDailyCheckins,
    });
  }
}

import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { UserGameProfiles } from '@prisma/client';

@Injectable({
  scope: Scope.REQUEST,
})
export class GameProfileRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async getByIdOrFirst(userId: string, gameProfileId?: string): Promise<UserGameProfiles> {
    return this.client.userGameProfiles.findFirst({
      where: {
        userId,
        id: gameProfileId,
      },
    });
  }

  async getFirst(userId: string): Promise<UserGameProfiles> {
    return this.client.userGameProfiles.findFirst({
      where: {
        userId,
      },
    });
  }

  async create(data: Partial<UserGameProfiles>): Promise<UserGameProfiles> {
    return this.client.userGameProfiles.create({
      data: data as UserGameProfiles,
    });
  }
}

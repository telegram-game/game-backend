import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { UserGameProfileAttributes, UserGameProfiles } from '@prisma/client';
import { FullGameProfileRepositoryModel } from '../models/game-profile.dto';

@Injectable({
  scope: Scope.REQUEST,
})
export class GameProfileAttributeRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async create(data: Partial<UserGameProfileAttributes>): Promise<UserGameProfileAttributes> {
    return this.client.userGameProfileAttributes.create({
      data: data as UserGameProfileAttributes,
    });
  }

  async updateOptimstic(data: Partial<UserGameProfileAttributes>, updatedAt: Date): Promise<UserGameProfileAttributes> {
    return this.client.userGameProfileAttributes.update({
      where: {
        id: data.id,
        updatedAt: updatedAt,
      },
      data: data as UserGameProfileAttributes,
    });
  }
}

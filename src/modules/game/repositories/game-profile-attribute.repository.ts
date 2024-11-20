import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { UserGameProfileAttribute, UserGameProfileAttributes } from '@prisma/client';

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

  async getTotalLevel(userId: string, gameprofileId: string): Promise<number> {
    return this.client.userGameProfileAttributes.aggregate({
      where: {
        userId,
        userGameProfileId: gameprofileId,
      },
      _sum: {
        value: true,
      },
    }).then((result) => result._sum.value ?? Object.keys(UserGameProfileAttribute).length);
  }
}

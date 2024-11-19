import { Injectable, Scope } from '@nestjs/common';
import { Tokens, UserTokenClaimInfomations } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserTokenClaimRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async get(userId: string, token: Tokens): Promise<UserTokenClaimInfomations> {
    return this.client.userTokenClaimInfomations.findFirst({
      where: {
        userId,
        token,
      },
    });
  }

  async create(
    data: Partial<UserTokenClaimInfomations>,
  ): Promise<UserTokenClaimInfomations> {
    return this.client.userTokenClaimInfomations.create({
      data: data as UserTokenClaimInfomations,
    });
  }

  async updateOptimistic(
    data: Partial<UserTokenClaimInfomations>,
    updatedAt: Date,
  ): Promise<UserTokenClaimInfomations> {
    return this.client.userTokenClaimInfomations.update({
      where: {
        userId_token: {
          userId: data.userId,
          token: data.token,
        },
        updatedAt,
      },
      data: data as UserTokenClaimInfomations,
    });
  }
}

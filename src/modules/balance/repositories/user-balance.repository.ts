import { Injectable, Scope } from '@nestjs/common';
import { Tokens, UserTokenBalances } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserBalanceRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async gets(userId: string): Promise<UserTokenBalances[]> {
    return this.client.userTokenBalances.findMany({
      where: {
        userId,
      },
    });
  }

  async get(userId: string, token: Tokens): Promise<UserTokenBalances> {
    return this.client.userTokenBalances.findUnique({
      where: {
        userId_token: {
          userId: userId,
          token: token,
        },
      },
    });
  }

  async create(data: Partial<UserTokenBalances>): Promise<UserTokenBalances> {
    return this.client.userTokenBalances.create({
      data: data as UserTokenBalances,
    });
  }

  async updateOptimistic(
    data: Partial<UserTokenBalances>,
    updatedAt: Date,
  ): Promise<UserTokenBalances> {
    return this.client.userTokenBalances.update({
      where: {
        userId_token: {
          userId: data.userId,
          token: data.token,
        },
        updatedAt,
      },
      data: data as UserTokenBalances,
    });
  }
}

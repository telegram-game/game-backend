import { Injectable, Scope } from '@nestjs/common';
import { UserTokenBalanceHistories } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserBalanceHistoryRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async create(
    data: Partial<UserTokenBalanceHistories>,
  ): Promise<UserTokenBalanceHistories> {
    return this.client.userTokenBalanceHistories.create({
      data: data as UserTokenBalanceHistories,
    });
  }
}

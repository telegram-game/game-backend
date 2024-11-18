import { Injectable, Scope } from '@nestjs/common';
import { UserTokenBalances } from '@prisma/client';
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

}

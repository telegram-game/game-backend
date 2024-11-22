import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { UserReferrals } from '@prisma/client';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserReferralRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async getPaging(userId: string, page: number, limit: number) {
    const total = await this.client.userReferrals.count({
      where: {
        userId,
      },
    });
    const data = await this.client.userReferrals.findMany({
      where: {
        userId,
      },
      include: {
        referredUser: {
          include: {
            userProfile: true,
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      total,
      data,
    };
  }

  async create(data: Partial<UserReferrals>): Promise<UserReferrals> {
    return this.client.userReferrals.create({
      data: data as UserReferrals,
    });
  }
}

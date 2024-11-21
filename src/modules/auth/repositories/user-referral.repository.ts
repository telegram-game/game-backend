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

  async create(data: Partial<UserReferrals>): Promise<UserReferrals> {
    return this.client.userReferrals.create({
      data: data as UserReferrals,
    });
  }
}

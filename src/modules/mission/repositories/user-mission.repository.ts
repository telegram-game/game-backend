import { Injectable, Scope } from '@nestjs/common';
import { UserMissions } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserMissionRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async create(data: Partial<UserMissions>): Promise<UserMissions> {
    return this.client.userMissions.create({
      data: data as UserMissions,
    });
  }
}

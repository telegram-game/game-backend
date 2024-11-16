import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { UserProfiles } from '@prisma/client';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserProfileRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async create(data: Partial<UserProfiles>): Promise<UserProfiles> {
    return this.client.userProfiles.create({
      data: data as UserProfiles,
    });
  }
}

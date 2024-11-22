import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { User, UserProvider } from '@prisma/client';
import { FullUserRepositoryModel } from '../models/user.dto';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async getFullById(
    userId: string,
    options?: {
      userProfile?: true;
    },
  ): Promise<FullUserRepositoryModel> {
    return this.client.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        userProfile: options?.userProfile,
      },
    });
  }

  async getByProvider(
    provider: UserProvider,
    providerId: string,
  ): Promise<User> {
    return this.client.user.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    });
  }

  async create(user: Partial<User>): Promise<User> {
    return this.client.user.create({
      data: user,
    });
  }
}

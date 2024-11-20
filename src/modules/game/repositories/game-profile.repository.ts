import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { UserGameProfiles } from '@prisma/client';
import { FullGameProfileRepositoryModel } from '../models/game-profile.dto';

@Injectable({
  scope: Scope.REQUEST,
})
export class GameProfileRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async getByIdOrFirst(
    userId: string,
    gameProfileId?: string,
    options?: {
      includeAttributes?: boolean;
    }
  ): Promise<FullGameProfileRepositoryModel> {
    return this.client.userGameProfiles.findFirst({
      where: {
        userId,
        id: gameProfileId,
      },
      include: {
        userGameProfileAttributes: options?.includeAttributes,
      }
    }).then((gameProfile) => {
      if (!gameProfile) {
        return null;
      }
      return {
        ...gameProfile,
        userGameProfileAttributes: gameProfile.userGameProfileAttributes ?? [],
      } as FullGameProfileRepositoryModel;
    });
  }

  async getRandomSameLevelGameProfile(fromLevel: number, toLevel: number, options?: {
    includeAttributes?: boolean;
  }): Promise<FullGameProfileRepositoryModel> {
    const count = await this.client.userGameProfiles.count({
      where: {
        totalLevel: {
          gte: fromLevel,
          lte: toLevel,
        }
      }
    }).then((count) => count);
    return this.client.userGameProfiles.findFirst({
      where: {
        totalLevel: {
          gte: fromLevel,
          lte: toLevel,
        }
      },
      include: {
        userGameProfileAttributes: options?.includeAttributes,
      },
      skip: Math.floor(Math.random() * count),
    }).then((gameProfile) => {
      if (!gameProfile) {
        return null;
      }
      return {
        ...gameProfile,
        userGameProfileAttributes: gameProfile.userGameProfileAttributes ?? [],
      } as FullGameProfileRepositoryModel;
    });
  }

  async getFirst(userId: string,
    options?: {
      includeAttributes?: boolean;
    }): Promise<FullGameProfileRepositoryModel> {
    return this.client.userGameProfiles.findFirst({
      where: {
        userId,
      },
      include: {
        userGameProfileAttributes: options?.includeAttributes,
      }
    }).then((gameProfile) => {
      if (!gameProfile) {
        return null;
      }
      return {
        ...gameProfile,
        userGameProfileAttributes: gameProfile.userGameProfileAttributes ?? [],
      } as FullGameProfileRepositoryModel;
    });
  }

  async create(data: Partial<UserGameProfiles>): Promise<UserGameProfiles> {
    return this.client.userGameProfiles.create({
      data: data as UserGameProfiles,
    });
  }

  async update(data: Partial<UserGameProfiles>): Promise<UserGameProfiles> {
    return this.client.userGameProfiles.update({
      where: {
        id: data.id,
      },
      data: data as UserGameProfiles,
    });
  }
}

import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { FullInventoryRepositoryModel } from '../models/inventory.model.dto';
import { UserGameInventories } from '@prisma/client';

@Injectable({
  scope: Scope.REQUEST,
})
export class InventoryRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async getById(
    userId: string,
    gameProfileId: string,
    id: string,
  ): Promise<FullInventoryRepositoryModel> {
    return this.client.userGameInventories.findFirst({
      where: {
        id,
        userId,
        userGameProfileId: gameProfileId,
      },
      include: {
        userGameInventoryAttributes: true,
      },
    });
  }

  async getByIds(
    ids: string[],
    userId: string,
    gameProfileId: string,
  ): Promise<FullInventoryRepositoryModel[]> {
    return this.client.userGameInventories.findMany({
      where: {
        userId,
        userGameProfileId: gameProfileId,
        id: {
          in: ids,
        },
      },
      include: {
        userGameInventoryAttributes: true,
      },
    });
  }

  async getAll(
    userId: string,
    gameProfileId: string,
  ): Promise<FullInventoryRepositoryModel[]> {
    return this.client.userGameInventories.findMany({
      where: {
        userId,
        userGameProfileId: gameProfileId,
      },
      include: {
        userGameInventoryAttributes: true,
      },
    });
  }

  async create(
    data: Partial<UserGameInventories>,
  ): Promise<UserGameInventories> {
    return this.client.userGameInventories.create({
      data: data as UserGameInventories,
    });
  }

  async updateOptimistic(
    data: Partial<UserGameInventories>,
    updatedAt: Date,
  ): Promise<UserGameInventories> {
    return this.client.userGameInventories.update({
      where: {
        id: data.id,
        userId: data.userId,
        userGameProfileId: data.userGameProfileId,
        updatedAt,
      },
      data: data as UserGameInventories,
    });
  }
}

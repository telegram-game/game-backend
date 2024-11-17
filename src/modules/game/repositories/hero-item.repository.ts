import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { ItemType, UserGameHeroItems } from '@prisma/client';

@Injectable({
  scope: Scope.REQUEST,
})
export class HeroItemRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async getItemByHeroAndType(
    userId: string,
    heroId: string,
    itemType: ItemType,
  ): Promise<UserGameHeroItems> {
    return this.client.userGameHeroItems.findFirst({
      where: {
        userId,
        userGameHeroId: heroId,
        itemType,
      },
    });
  }

  async create(data: Partial<UserGameHeroItems>): Promise<UserGameHeroItems> {
    return this.client.userGameHeroItems.create({
      data: data as UserGameHeroItems,
    });
  }

  async updateOptimistic(
    data: Partial<UserGameHeroItems>,
    updatedAt: Date,
  ): Promise<UserGameHeroItems> {
    return this.client.userGameHeroItems.update({
      where: {
        userId: data.userId,
        id: data.id,
        updatedAt: updatedAt,
      },
      data: data as UserGameHeroItems,
    });
  }

  async remove(
    userId: string,
    gameProfileId: string,
    inventoryId: string,
  ): Promise<void> {
    await this.client.userGameHeroItems.deleteMany({
      where: {
        userId,
        userGameHeroId: gameProfileId,
        inventoryId,
      },
    });
  }
}

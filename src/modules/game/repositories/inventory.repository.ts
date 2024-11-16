import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { FullInventoryRepositoryModel } from '../models/inventory.model.dto';

@Injectable({
  scope: Scope.REQUEST,
})
export class InventoryRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async getByIds(
    ids: string[],
    userId: string,
  ): Promise<FullInventoryRepositoryModel[]> {
    return this.client.userGameInventories.findMany({
      where: {
        userId,
        id: {
          in: ids,
        },
      },
      include: {
        userGameInventoryAttributes: true,
      },
    });
  }
}

import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { UserGameInventoryAttributes } from '@prisma/client';

@Injectable({
  scope: Scope.REQUEST,
})
export class InventoryAttributeRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async create(
    data: Partial<UserGameInventoryAttributes>,
  ): Promise<UserGameInventoryAttributes> {
    return this.client.userGameInventoryAttributes.create({
      data: data as UserGameInventoryAttributes,
    });
  }
}

import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { UserGameHeroAttributes } from '@prisma/client';

@Injectable({
  scope: Scope.REQUEST,
})
export class HeroAttributeRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async create(
    data: Partial<UserGameHeroAttributes>,
  ): Promise<UserGameHeroAttributes> {
    return this.client.userGameHeroAttributes.create({
      data: data as UserGameHeroAttributes,
    });
  }
}

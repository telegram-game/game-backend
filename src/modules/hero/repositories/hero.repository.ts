import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { FullHeroRepositoryModel } from '../models/hero.model.dto';

@Injectable({
  scope: Scope.REQUEST,
})
export class HeroRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async getFullFirst(userId: string): Promise<FullHeroRepositoryModel> {
    return this.client.userGameHeros.findFirst({
      where: {
        userId,
      },
      include: {
        userGameProfile: true,
        userGameHeroAttributes: true,
        userGameHeroItems: true,
        userGameHeroSkills: true,
      },
    });
  }
}

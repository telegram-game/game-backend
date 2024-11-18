import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { FullHeroRepositoryModel } from '../models/hero.model.dto';
import { UserGameHeros } from '@prisma/client';

@Injectable({
  scope: Scope.REQUEST,
})
export class HeroRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async getFullById(
    userId: string,
    userGameProfileId: string,
    heroId: string,
  ): Promise<FullHeroRepositoryModel> {
    return this.client.userGameHeros.findFirst({
      where: {
        id: heroId,
        userId,
        userGameProfileId: userGameProfileId,
      },
      include: {
        userGameProfile: true,
        userGameHeroAttributes: true,
        userGameHeroItems: true,
        userGameHeroSkills: true,
      },
    });
  }

  async getFullFirst(
    userId: string,
    userGameProfileId: string,
  ): Promise<FullHeroRepositoryModel> {
    return this.client.userGameHeros.findFirst({
      where: {
        userId,
        userGameProfileId: userGameProfileId,
      },
      include: {
        userGameProfile: true,
        userGameHeroAttributes: true,
        userGameHeroItems: true,
        userGameHeroSkills: true,
      },
    });
  }

  async getFirst(
    userId: string,
    userGameProfileId: string,
  ): Promise<UserGameHeros> {
    return this.client.userGameHeros.findFirst({
      where: {
        userId,
        userGameProfileId: userGameProfileId,
      },
    });
  }

  async createDefault(
    userId: string,
    userGameProfileId: string,
  ): Promise<UserGameHeros> {
    return this.client.userGameHeros.create({
      data: {
        userId,
        userGameProfileId,
        level: 1,
        totalPower: 0,
      },
    });
  }
}

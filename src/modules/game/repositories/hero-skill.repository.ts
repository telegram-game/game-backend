import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';
import { UserGameHeroSkills } from '@prisma/client';

@Injectable({
  scope: Scope.REQUEST,
})
export class HeroSkillRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }

  async getFirstByHeroId(userId: string, heroId: string): Promise<UserGameHeroSkills> {
    return this.client.userGameHeroSkills.findFirst({
      where: {
        userGameHeroId: heroId,
        userId,
      }
    });
  }

  async create(data: Partial<UserGameHeroSkills>): Promise<UserGameHeroSkills> {
    return this.client.userGameHeroSkills.create({
      data: data as UserGameHeroSkills,
    });
  }

  async update(data: Partial<UserGameHeroSkills>): Promise<UserGameHeroSkills> {
    return this.client.userGameHeroSkills.update({
      where: {
        id: data.id,
      },
      data: data as UserGameHeroSkills,
    });
  }
}

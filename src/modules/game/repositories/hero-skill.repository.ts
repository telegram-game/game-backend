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

  async create(data: Partial<UserGameHeroSkills>): Promise<UserGameHeroSkills> {
    return this.client.userGameHeroSkills.create({
      data: data as UserGameHeroSkills,
    });
  }
}

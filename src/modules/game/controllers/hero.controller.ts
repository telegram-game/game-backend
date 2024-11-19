import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChangeSkillRequest, FullHero } from '../models/hero.model.dto';
import asyncLocalStorage from 'src/storage/async_local';
import { GameProfileService } from '../services/game-profile.service';
import { HeroService } from '../services/hero.service';

@Controller({
  path: ['/api/v1.0/games/heroes'],
  version: ['1.0'],
})
export class HeroController {
  constructor(
    private gameProfileService: GameProfileService,
    private heroService: HeroService,
  ) {}

  @Get()
  async getFirst(): Promise<FullHero> {
    const userId = asyncLocalStorage.getStore().userInfo?.userId;
    const data = await this.gameProfileService.getFullFirst(userId);
    return data.hero;
  }

  @Post('/change-skill')
  async changeSkill(@Body() data: ChangeSkillRequest): Promise<void> {
    const userId = asyncLocalStorage.getStore().userInfo?.userId;
    await this.heroService.changeSkill(userId, data.heroId, data.skill);
  }
}

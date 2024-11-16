import { Controller, Get } from '@nestjs/common';
import { FullHero } from '../models/hero.model.dto';
import asyncLocalStorage from 'src/storage/async_local';
import { GameProfileService } from '../services/game-profile.service';

@Controller({
  path: ['/api/v1.0/games/heroes'],
  version: ['1.0'],
})
export class HeroController {
  constructor(private gameProfileService: GameProfileService) {}

  @Get()
  async getFirst(): Promise<FullHero> {
    const userId = asyncLocalStorage.getStore().userInfo?.userId;
    const data = await this.gameProfileService.getFullFirst(userId);
    return data.hero;
  }
}

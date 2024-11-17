import { Controller, Get } from '@nestjs/common';
import asyncLocalStorage from 'src/storage/async_local';
import { GameProfileService } from '../services/game-profile.service';
import { FullGameProfile } from '../models/game-profile.dto';

@Controller({
  path: ['/api/v1.0/games/game-profiles'],
  version: ['1.0'],
})
export class GameProfileController {
  constructor(private gameProfileService: GameProfileService) {}

  @Get()
  async getFirst(): Promise<FullGameProfile> {
    const userId = asyncLocalStorage.getStore().userInfo?.userId;
    const data = await this.gameProfileService.getFullFirst(userId);
    return data;
  }
}

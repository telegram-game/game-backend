import { Body, Controller, Get, Post } from '@nestjs/common';
import asyncLocalStorage from 'src/storage/async_local';
import { GameProfileService } from '../services/game-profile.service';
import { ChangeHouseReqeust, FullGameProfile } from '../models/game-profile.dto';

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

  @Post('/change-house')
  async changeHouse(@Body() data: ChangeHouseReqeust): Promise<void> {
    const userId = asyncLocalStorage.getStore().userInfo?.userId;
    await this.gameProfileService.changeHouse(userId, data.gameProfileId, data.house);
  }
}

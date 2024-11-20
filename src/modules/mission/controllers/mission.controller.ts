import { Body, Controller, Get, Post } from '@nestjs/common';
import { MissionClaimRewardRequest } from '../models/mission';
import { MissionService } from '../services/mission.service';
import { Missions } from '@prisma/client';
import asyncLocalStorage from 'src/storage/async_local';

@Controller({
  path: ['/api/v1.0/missions'],
  version: ['1.0'],
})
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get('')
  async gets(): Promise<Missions[]> {
    const userId = asyncLocalStorage.getStore().userInfo.userId;
    return await this.missionService.getsSatifiedByUserId(userId);
  }

  @Post('')
  async claimReward(@Body() data: MissionClaimRewardRequest): Promise<void> {
    const userId = asyncLocalStorage.getStore().userInfo.userId;
    await this.missionService.claimReward(userId, data);
  }
}

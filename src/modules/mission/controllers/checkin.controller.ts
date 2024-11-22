import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import asyncLocalStorage from 'src/storage/async_local';
import { CheckinService } from '../services/checkin.service';
import {
  CheckinDataReponse,
  ClaimCheckinRequest,
  GetCheckinRequest,
} from '../models/checkin';

@Controller({
  path: ['/api/v1.0/checkins'],
  version: ['1.0'],
})
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Get('')
  async gets(@Query() data: GetCheckinRequest): Promise<CheckinDataReponse> {
    const userId = asyncLocalStorage.getStore().userInfo.userId;
    return await this.checkinService.gets(userId, data.gameProfileId);
  }

  @Post('/claim')
  async claim(@Body() data: ClaimCheckinRequest): Promise<CheckinDataReponse> {
    const userId = asyncLocalStorage.getStore().userInfo.userId;
    return await this.checkinService.claimReward(userId, data);
  }
}

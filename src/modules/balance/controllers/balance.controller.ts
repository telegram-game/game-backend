import { Body, Controller, Get, Post } from '@nestjs/common';
import asyncLocalStorage from 'src/storage/async_local';
import { BalanceInformationResponse, ClaimRequest } from '../models/balance.dto';
import { UserBalanceService } from '../services/user-balance.service';
import { BalanceService } from '../services/balance.service';

@Controller({
  path: ['/api/v1.0/balances'],
  version: ['1.0'],
})
export class BalanceController {
  constructor(private readonly userBalanceService: UserBalanceService, private readonly balanceService: BalanceService) {}

  @Post('/claim')
  async changeHouse(@Body() data: ClaimRequest): Promise<number> {
    const userId = asyncLocalStorage.getStore().userInfo?.userId;
    return await this.userBalanceService.claim(userId, data.token);
  }

  @Get('/me')
  async getMe(): Promise<BalanceInformationResponse> {
    const userId = asyncLocalStorage.getStore().userInfo?.userId;
    return await this.balanceService.getInformation(userId);
  }
}

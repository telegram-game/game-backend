import { Body, Controller, Post } from '@nestjs/common';
import asyncLocalStorage from 'src/storage/async_local';
import { ClaimRequest } from '../models/balance.dto';
import { UserBalanceService } from '../services/user-balance.service';

@Controller({
  path: ['/api/v1.0/balances'],
  version: ['1.0'],
})
export class BalanceController {
  constructor(private userBalanceService: UserBalanceService) {}

  @Post('/claim')
  async changeHouse(@Body() data: ClaimRequest): Promise<number> {
    const userId = asyncLocalStorage.getStore().userInfo?.userId;
    return await this.userBalanceService.claim(userId, data.token);
  }
}
import { Body, Controller, Get } from '@nestjs/common';
import { UserReferralService } from '../services/user-referral.service';
import {
  GetReferralPagingRequest,
  GetReferralPagingResponse,
} from '../models/user-referral.dto';
import asyncLocalStorage from 'src/storage/async_local';

@Controller({
  path: ['/api/v1.0/user-referrals'],
  version: ['1.0'],
})
export class UserReferralController {
  constructor(private readonly userReferralService: UserReferralService) {}

  @Get('')
  async gets(
    @Body() data: GetReferralPagingRequest,
  ): Promise<GetReferralPagingResponse> {
    const userId = asyncLocalStorage.getStore().userInfo?.userId;
    return this.userReferralService.getPaging(userId, data.page, data.limit);
  }
}

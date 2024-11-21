import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { FullUserModel } from '../models/user.dto';
import { UserService } from './user.service';
import { UserReferralRepository } from '../repositories/user-referral.repository';
import { UserProvider } from '@prisma/client';
import { BalanceService } from 'src/modules/shared/services/balance.service';
import {configurationData} from '../../../data'

@Injectable()
export class UserReferralService {
  constructor(
    private readonly userReferralRepository: UserReferralRepository,
    private readonly userService: UserService,
    private readonly balanceService: BalanceService,
    private prismaService: PrismaService,
  ) {}

  async executeReferralCodeLogic(user: FullUserModel, provider: UserProvider, referralCode: string): Promise<void> {
    const referralCampaign = configurationData.system.referralCampaign;
    if (!referralCampaign) {
      return;
    }

    const referrerUser = await this.userService.getByProvider(provider, referralCode);
    if (!referrerUser) {
      return;
    }

    await this.userReferralRepository.create({
      userId: user.id,
      provider,
      providerUserId: user.id,
    })

    // Increase referrer balance
    await this.balanceService.increase(referrerUser.id, referralCampaign.rewardToken, referralCampaign.referrerReward, {
      type: 'referral-completed',
        additionalData: {
          referralCampaign,
          referralAt: new Date(),
          provider: provider,
          referralCode: referralCode,
        }
    });

    // Increase user balance
    await this.balanceService.increase(user.id, referralCampaign.rewardToken, referralCampaign.userReward, {
      type: 'referral-completed',
        additionalData: {
          referralCampaign,
          referralAt: new Date(),
          provider: provider,
          referralCode: referralCode,
        }
    });
  }
}

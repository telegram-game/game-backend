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
  ) {}

  async executeReferralCodeLogic(user: FullUserModel, provider: UserProvider, referralCode: string, isPremium?: boolean): Promise<void> {
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
    const referrerReward = isPremium ? referralCampaign.premiumReferrerReward : referralCampaign.referrerReward;
    await this.balanceService.increase(referrerUser.id, referralCampaign.rewardToken, referrerReward, {
      type: 'referral-completed',
        additionalData: {
          referralCampaign,
          referralAt: new Date(),
          provider: provider,
          referralCode: referralCode,
          isPremium,
        }
    });

    // Increase user balance
    const userReward = isPremium ? referralCampaign.premiumUserReward : referralCampaign.userReward;
    await this.balanceService.increase(user.id, referralCampaign.rewardToken, userReward, {
      type: 'referral-completed',
        additionalData: {
          referralCampaign,
          referralAt: new Date(),
          provider: provider,
          referralCode: referralCode,
          isPremium,
        }
    });
  }
}

import { Injectable } from '@nestjs/common';
import { FullUserModel } from '../models/user.dto';
import { UserService } from './user.service';
import { UserReferralRepository } from '../repositories/user-referral.repository';
import { UserProvider } from '@prisma/client';
import { BalanceService } from 'src/modules/shared/services/balance.service';
import { configurationData } from '../../../data';
import { GetReferralPagingResponse } from '../models/user-referral.dto';

@Injectable()
export class UserReferralService {
  constructor(
    private readonly userReferralRepository: UserReferralRepository,
    private readonly userService: UserService,
    private readonly balanceService: BalanceService,
  ) {}

  async getPaging(
    userId: string,
    page: number,
    limit: number,
  ): Promise<GetReferralPagingResponse> {
    limit = Math.min(limit ?? 100, 100);
    page = Math.max(page ?? 1, 1);
    return this.userReferralRepository
      .getPaging(userId, page, limit)
      .then((data) => {
        return {
          total: data.total,
          page: page,
          limit: limit,
          data: data.data.map((item) => ({
            userId: item.referredUserId,
            firstName: item.referredUser?.userProfile[0]?.firstName || '',
            lastName: item.referredUser?.userProfile[0]?.lastName || '',
          })),
        };
      });
  }

  async executeReferralCodeLogic(
    user: FullUserModel,
    provider: UserProvider,
    providerId: string,
    referralCode: string,
    isPremium?: boolean,
  ): Promise<void> {
    const referralCampaign = configurationData.system.referralCampaign;
    if (!referralCampaign) {
      return;
    }

    const referrerUser = await this.userService.getByProvider(
      provider,
      referralCode,
    );
    if (!referrerUser) {
      return;
    }

    await this.userReferralRepository.create({
      userId: referrerUser.id,
      provider,
      providerUserId: providerId,
      referredUserId: user.id,
    });

    // Increase referrer balance
    const referrerReward = isPremium
      ? referralCampaign.premiumReferrerReward
      : referralCampaign.referrerReward;
    await this.balanceService.increase(
      referrerUser.id,
      referralCampaign.rewardToken,
      referrerReward,
      {
        type: 'referral-completed',
        additionalData: {
          referralCampaign,
          referralAt: new Date(),
          provider: provider,
          referralCode: referralCode,
          isPremium,
        },
      },
    );

    // Increase user balance
    const userReward = isPremium
      ? referralCampaign.premiumUserReward
      : referralCampaign.userReward;
    await this.balanceService.increase(
      user.id,
      referralCampaign.rewardToken,
      userReward,
      {
        type: 'referral-completed',
        additionalData: {
          referralCampaign,
          referralAt: new Date(),
          provider: provider,
          referralCode: referralCode,
          isPremium,
        },
      },
    );
  }
}

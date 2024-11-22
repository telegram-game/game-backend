import { HttpStatus, Injectable } from '@nestjs/common';
import { BusinessException } from 'src/exceptions';
import { BalanceService } from 'src/modules/shared/services/balance.service';
import { configurationData } from '../../../data';
import { CheckinRepository } from '../repositories/checkin.repository';
import dayjs from 'dayjs';
import { CheckinCampaign } from 'src/data/system';
import { CheckinDataReponse, ClaimCheckinRequest } from '../models/checkin';

@Injectable()
export class CheckinService {
  constructor(
    private readonly checkinRepository: CheckinRepository,
    private readonly balanceService: BalanceService,
  ) { }

  async gets(userId: string, gameProfileId: string): Promise<CheckinDataReponse> {
    const checkinCampaign = configurationData.system.checkinCampaign;
    const limit = checkinCampaign.maxStack || 7; // Maximym 7 days
    const data = await this.checkinRepository.gets(userId, gameProfileId, {
      limit,
    });

    let currentCheck = this.calculateCheckinCode();
    let currentStack = 1;
    for (let i = 0; i < data.length; i++) {
      const checkin = data[i];
      if (this.isPrevious1DayStack(currentCheck, checkin.checkinCode)) {
        currentCheck = checkin.checkinCode
        currentStack++;
      } else if (currentCheck === checkin.checkinCode) {
        continue;
      } else {
        break;
      }
    }

    return {
      currentStack,
      data,
    }
  }

  async claimReward(userId: string, data: ClaimCheckinRequest): Promise<CheckinDataReponse> {
    const checkinCampaign = configurationData.system.checkinCampaign;
    if (!checkinCampaign) {
      throw new BusinessException({ status: HttpStatus.BAD_REQUEST, errorCode: 'CHECKIN_CAMPAIGN_NOT_FOUND', errorMessage: 'Checkin campaign not found' });
    }

    const checkinCode = this.calculateCheckinCode();
    await this.checkinRepository.create({
      userId,
      userGameProfileId: data.gameProfileId,
      checkinCode,
    }).catch((error) => {
      // Check unique constraint
      if (error.code === 'P2002') { 
        throw new BusinessException({ status: HttpStatus.BAD_REQUEST, errorCode: 'CHECKIN_ALREADY_CLAIMED', errorMessage: 'Checkin already claimed' });
      }
    })

    const checkinData = await this.gets(userId, data.gameProfileId);
    const stack = checkinData.currentStack;
    const claimedAmount = this.calculateClaimedAmount(checkinCampaign, stack);

    // Call to balance service to increase the balance
    await this.balanceService.increase(userId, checkinCampaign.rewardToken, claimedAmount, {
      type: 'checkin-completed',
        additionalData: {
          checkinCampaign,
          claimedAmount,
          checkinAt: new Date(),
        }
    });

    // return this.gets(userId, data.gameProfileId);
    return checkinData;
  }

  private calculateCheckinCode(date?: Date): string {
    return dayjs(date).utc().format('YYYY-MM-DD');
  }

  private calculateDateFromCheckinCode(code: string): Date {
    return dayjs(code, 'YYYY-MM-DD').toDate();
  }

  private isPrevious1DayStack(currentCode: string, code: string): boolean {
    const currentDate = this.calculateDateFromCheckinCode(currentCode);
    const date = this.calculateDateFromCheckinCode(code);
    return dayjs(currentDate).diff(date, 'day') === 1;
  }

  private calculateClaimedAmount(checkinCampaign: CheckinCampaign,  stack: number): number {
    return checkinCampaign.reward + checkinCampaign.stackCoefficient * (stack - 1);
  }
}

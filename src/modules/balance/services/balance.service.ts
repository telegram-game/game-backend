import { Injectable } from '@nestjs/common';
import { Tokens } from '@prisma/client';
import { UserBalanceRepository } from '../repositories/user-balance.repository';
import { UserTokenClaimRepository } from '../repositories/user-token-claim.repository';
import { AuthService } from 'src/modules/shared/services/auth.service';
import { PrismaService } from 'src/modules/prisma';
import { UserBalanceHistoryRepository } from '../repositories/user-balance-history.repository';
import { BalanceInformationResponse } from '../models/balance.dto';
import { configurationData } from '../../../data';

@Injectable()
export class BalanceService {
  constructor(
    private readonly userBalanceRepository: UserBalanceRepository,
    private readonly userBalanceHistoryRepisitory: UserBalanceHistoryRepository,
    private readonly userTokenClaimRepository: UserTokenClaimRepository,
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {}

  async getInformation(userId: string): Promise<BalanceInformationResponse> {
    const canClaimedTokens = Object.keys(
      configurationData.system.baseTokenInvestSpeed,
    );
    const balances = await this.userBalanceRepository.gets(userId);
    const claimInfos = await this.userTokenClaimRepository.gets(userId);

    let userCreatedAt: Date | null = null;
    if (claimInfos.length < canClaimedTokens.length) {
      const user = await this.authService.getUserById(userId);
      userCreatedAt = user.createdAt;
    }

    const result: BalanceInformationResponse = {
      balances: {},
      lastClaimedAt: {},
    };

    const tokenKeys = Object.keys(Tokens);
    for (const token of tokenKeys) {
      const tokenEnum = Tokens[token];
      const balance = balances.find((balance) => balance.token === tokenEnum);
      result.balances[tokenEnum] = balance?.balance || 0;
    }

    for (const token of canClaimedTokens) {
      const claimInfo = claimInfos.find(
        (claimInfo) => claimInfo.token === token,
      );
      result.lastClaimedAt[token] = claimInfo?.lastClaimAt || userCreatedAt;
    }

    return result;
  }
}

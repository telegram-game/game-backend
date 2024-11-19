import { HttpStatus, Injectable } from '@nestjs/common';
import { Tokens, UserTokenBalances } from '@prisma/client';
import { UserBalanceRepository } from '../repositories/user-balance.repository';
import { UserTokenClaimRepository } from '../repositories/user-token-claim.repository';
import { AuthService } from 'src/modules/shared/services/auth.service';
import { BusinessException } from 'src/exceptions';
import { configurationData } from '../../../data';
import { PrismaService } from 'src/modules/prisma';
import { UserBalanceHistoryRepository } from '../repositories/user-balance-history.repository';

@Injectable()
export class UserBalanceService {
  constructor(
    private readonly userBalanceRepository: UserBalanceRepository,
    private readonly userBalanceHistoryRepisitory: UserBalanceHistoryRepository,
    private readonly userTokenClaimRepository: UserTokenClaimRepository,
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {}

  async get(userId: string, token: Tokens): Promise<UserTokenBalances> {
    return await this.userBalanceRepository.get(userId, token);
  }

  async gets(userId: string): Promise<UserTokenBalances[]> {
    return await this.userBalanceRepository.gets(userId);
  }

  async decreaseBalance(userId: string, token: Tokens, amount: number, metaData: any): Promise<number> {
    return await this.prismaService.$transaction(async (tx: PrismaService) => {
      this.userBalanceRepository.joinTransaction(tx);
      this.userTokenClaimRepository.joinTransaction(tx);
      this.userBalanceHistoryRepisitory.joinTransaction(tx);

      let balance = await this.userBalanceRepository.get(userId, token);

      const currentBalance = balance.balance;
      const lastBalance = currentBalance - amount;
      if (lastBalance < 0) {
        throw new BusinessException({
          status: HttpStatus.BAD_REQUEST,
          errorCode: 'INSUFFICIENT_BALANCE',
          errorMessage: 'Insufficient balance',
        });
      }
      
      await this.userBalanceRepository.updateOptimistic(
        {
          userId,
          token,
          balance: lastBalance,
        },
        balance.updatedAt,
      );

      await this.userBalanceHistoryRepisitory.create({
        userId,
        token,
        fromBalance: currentBalance,
        toBalance: lastBalance,
        metaData,
      });

      return lastBalance;
    });
  }

  async claim(userId: string, token: Tokens): Promise<number> {
    const investSpeedInfo =
      configurationData.system.baseTokenInvestSpeed[token];
    const { speed, gapTime: configGapTime } = investSpeedInfo;
    if (!investSpeedInfo) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: 'INVALID_TOKEN',
        errorMessage: 'Invalid token',
      });
    }
    let lastClaimedAt: Date | null = null;
    const claimInfo = await this.userTokenClaimRepository.get(userId, token);
    if (!claimInfo) {
      const user = await this.authService.getUserById(userId);
      if (!user) {
        throw new BusinessException({
          status: HttpStatus.BAD_REQUEST,
          errorCode: 'USER_NOT_FOUND',
          errorMessage: 'User not found',
        });
      }
      lastClaimedAt = user.createdAt;
    } else {
      lastClaimedAt = claimInfo.lastClaimAt;
    }

    const totalTimeInSeconds =
      (new Date().getTime() - lastClaimedAt.getTime()) / 1000;
    if (configGapTime > totalTimeInSeconds) {
      throw new BusinessException({
        status: HttpStatus.BAD_REQUEST,
        errorCode: 'CLAIM_TOO_FAST',
        errorMessage: 'Claim Too fast',
      });
    }

    const calculatedToken = speed * totalTimeInSeconds;
    return await this.prismaService.$transaction(async (tx: PrismaService) => {
      this.userBalanceRepository.joinTransaction(tx);
      this.userTokenClaimRepository.joinTransaction(tx);
      this.userBalanceHistoryRepisitory.joinTransaction(tx);

      let currentBalance = 0;
      let lastBalance = 0;
      let balance = await this.userBalanceRepository.get(userId, token);
      if (!balance) {
        lastBalance = calculatedToken;
        balance = await this.userBalanceRepository.create({
          userId,
          token,
          balance: lastBalance,
        });
      } else {
        currentBalance = balance.balance;
        lastBalance = balance.balance + calculatedToken;
        await this.userBalanceRepository.updateOptimistic(
          {
            userId,
            token,
            balance: lastBalance,
          },
          balance.updatedAt,
        );
      }

      await this.userBalanceHistoryRepisitory.create({
        userId,
        token,
        fromBalance: currentBalance,
        toBalance: lastBalance,
        metaData: {
          type: 'claim',
          additionalData: {
            claimedToken: calculatedToken,
            lastClaimedAt: lastClaimedAt,
            claimedAt: new Date(),
          },
        },
      });

      if (claimInfo) {
        await this.userTokenClaimRepository.updateOptimistic(
          {
            userId,
            token,
            lastClaimAt: new Date(),
          },
          claimInfo.updatedAt,
        );
      } else {
        await this.userTokenClaimRepository.create({
          userId,
          token,
          lastClaimAt: new Date(),
        });
      }

      return lastBalance;
    });
  }
}

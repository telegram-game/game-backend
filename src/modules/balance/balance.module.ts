import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { UserBalanceRepository } from './repositories/user-balance.repository';
import { UserBalanceService } from './services/user-balance.service';
import { UserTokenClaimRepository } from './repositories/user-token-claim.repository';
import { UserBalanceHistoryRepository } from './repositories/user-balance-history.repository';
import { BalanceController } from './controllers/balance.controller';
import { BalanceService } from './services/balance.service';
@Module({
  imports: [PrismaModule],
  controllers: [BalanceController],
  providers: [
    UserBalanceRepository,
    UserBalanceHistoryRepository,
    UserTokenClaimRepository,
    UserBalanceService,
    BalanceService,
  ],
  exports: [UserBalanceService],
})
export class BalanceModule {}

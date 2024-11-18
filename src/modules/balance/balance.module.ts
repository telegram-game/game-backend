import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { UserBalanceRepository } from './repositories/user-balance.repository';
import { UserBalanceService } from './services/user-balance.service';
@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [UserBalanceRepository, UserBalanceService],
  exports: [UserBalanceService],
})
export class BalanceModule {}

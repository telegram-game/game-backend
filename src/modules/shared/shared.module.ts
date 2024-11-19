import { Global, Module } from '@nestjs/common';
import { HttpModule } from '../http';
import { SupportService } from './services/support.service';
import { AuthService } from './services/auth.service';
import { BalanceModule } from '../balance';
import { BalanceService } from './services/balance.service';
import { AuthModule } from '../auth';

@Global()
@Module({
  imports: [HttpModule, BalanceModule, AuthModule],
  providers: [SupportService, AuthService, BalanceService],
  exports: [SupportService, AuthService, BalanceService],
})
export class SharedModule {}

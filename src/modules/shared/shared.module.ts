import { Global, Module } from '@nestjs/common';
import { HttpModule } from '../http';
import { SupportService } from './services/support.service';
import { AuthService } from './services/auth.service';
import { BalanceModule } from '../balance';
import { BalanceService } from './services/balance.service';
import { AuthModule } from '../auth';
import { TelegramService } from './services/telegram.service';

@Global()
@Module({
  imports: [HttpModule, BalanceModule, AuthModule],
  providers: [SupportService, AuthService, BalanceService, TelegramService],
  exports: [SupportService, AuthService, BalanceService, TelegramService],
})
export class SharedModule {}

import { Global, Module } from '@nestjs/common';
import { HttpModule } from '../http';
import { SupportService } from './services/support.service';
import { AuthService } from './services/auth.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [SupportService, AuthService],
  exports: [SupportService, AuthService],
})
export class SharedModule {}

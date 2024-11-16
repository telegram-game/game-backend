import { Global, Module } from '@nestjs/common';
import { HttpModule } from '../http';
import { SupportService } from './services/support.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [SupportService],
  exports: [SupportService],
})
export class SharedModule {}

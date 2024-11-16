import { Global, Module } from '@nestjs/common';
import { HttpModule } from '../http';

@Global()
@Module({
  imports: [HttpModule],
  providers: [],
  exports: [],
})
export class SharedModule {}

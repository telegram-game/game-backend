import { Module } from '@nestjs/common';
import { HttpModule } from '../http';

@Module({
  imports: [HttpModule],
  providers: [],
  exports: [],
})
export class SharedModule {}

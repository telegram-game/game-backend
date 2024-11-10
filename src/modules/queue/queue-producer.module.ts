import { Module } from '@nestjs/common';
import { CachingModule } from '../caching';
@Module({
  imports: [
    CachingModule,
  ],
  providers: [],
  exports: [],
})
export class QueueProducerModule {}

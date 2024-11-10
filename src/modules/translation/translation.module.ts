import { Module } from '@nestjs/common';
import { TranslationService } from './services/translation.service';

@Module({
  controllers: [],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}

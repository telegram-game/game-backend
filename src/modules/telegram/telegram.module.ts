import { DynamicModule, Module } from '@nestjs/common';
import { TelegramBotService } from './services/telegram-bot.service';
import { ConfigService } from '@nestjs/config';
import { TelegramBotServiceOption } from './models/telegram.bot';
import { Logger } from '../loggers';

let telegramBotService: TelegramBotService | null = null;

@Module({})
export class TelegramModule {
  static registerAsync(options: TelegramBotServiceOption): DynamicModule {
    return {
      module: TelegramModule,
      providers: [
        {
          provide: TelegramBotService,
          inject: [ConfigService, Logger],
          useFactory: (configService: ConfigService, logger: Logger) => {
            if (!telegramBotService) {
              telegramBotService = new TelegramBotService(
                configService,
                logger,
                options,
              );
            }
            return telegramBotService;
          },
        },
      ],
      exports: [TelegramBotService],
    };
  }
}

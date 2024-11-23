import { DynamicModule, Module } from '@nestjs/common';
import { TelegramBotService } from './services/telegram-bot.service';
import { ConfigService } from '@nestjs/config';
import { TelegramBotServiceOption } from './models/telegram.bot';

let telegramBotService: TelegramBotService | null = null;

@Module({})
export class TelegramModule {
  static registerAsync(options: TelegramBotServiceOption): DynamicModule {
    return {
      module: TelegramModule,
      providers: [
        {
          provide: TelegramBotService,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            if (!telegramBotService) {
              telegramBotService = new TelegramBotService(
                configService,
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

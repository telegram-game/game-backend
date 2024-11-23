import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';
import {
  TelegramBotServiceOption,
  TelegramCurrency,
} from '../models/telegram.bot';
import { LabeledPrice } from 'grammy/types';

export class TelegramBotService implements OnModuleInit, OnModuleDestroy {
  private bot: Bot;
  private readonly telegramBotToken: string;
  constructor(
    configService: ConfigService,
    private readonly options: TelegramBotServiceOption,
  ) {
    this.telegramBotToken = configService.get<string>('telegramBotToken');
  }

  onModuleDestroy() {
    this.bot.stop();
    this.bot = null;
  }

  onModuleInit() {
    this.bot = new Bot(this.telegramBotToken);
    if (this.options.isRunBotEvent) {
      this.bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));
      this.bot.start();

      this.bot.on('pre_checkout_query', (ctx) => {
        this.options?.onPrePayment(ctx);
      });

      this.bot.on('message:successful_payment', (ctx) => {
        console.log(ctx.message.successful_payment);
        this.options?.onSuccessfulPayment(ctx);
      });
    }
  }

  public onPrePayment(callback: (ctx: any) => Promise<void>) {
    this.options.onPrePayment = callback;
  }

  public onSuccessfulPayment(callback: (ctx: any) => Promise<void>) {
    this.options.onSuccessfulPayment = callback;
  }

  async createInvoice<T>(
    prices: LabeledPrice[],
    currency: TelegramCurrency,
    options?: {
      title?: string;
      description?: string;
      payload?: T;
      providerToken?: string;
    },
  ): Promise<string> {
    if (!Array.isArray(prices) || prices.length === 0) {
      throw new Error('Prices must be an array with at least one item.');
    }

    return await this.bot.api.createInvoiceLink(
      options?.title || 'Payment',
      options?.description || 'Payment something',
      JSON.stringify(options?.payload || {}),
      this.buildProviderToken(currency, options?.providerToken),
      currency,
      prices,
    );
  }

  async refund(
    telegramUserId: number,
    telegramPaymentChargeId: string,
  ): Promise<void> {
    this.bot.api.refundStarPayment(telegramUserId, telegramPaymentChargeId);
  }

  // Provider token must be empty for Telegram Stars
  private buildProviderToken(
    currency: TelegramCurrency,
    providerToken: string,
  ): string {
    if (currency === 'XTR') {
      return '';
    }

    return providerToken;
  }
}

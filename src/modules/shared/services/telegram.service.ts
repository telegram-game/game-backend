import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cryptoJS from 'crypto-js';
import { TelegramDataUserModel } from '../models/telegram';
import { Environment } from 'src/config/validation';

@Injectable()
export class TelegramService {
  private readonly telegramBotToken: string;
  private readonly env: Environment;
  constructor(private configService: ConfigService) {
    this.telegramBotToken = this.configService.get<string>('telegramBotToken');
    this.env = this.configService.get<Environment>('env');
  }

  verify(code: string): TelegramDataUserModel {
    const initData = new URLSearchParams(code);
    const verified = this.env === Environment.Local ? true : this.verifyTelegranData(initData);
    if (verified) {
      return JSON.parse(initData.get('user')) as TelegramDataUserModel;
    }
    return null;
  }

  private verifyTelegranData(initData: URLSearchParams): boolean {
    const hash = initData.get('hash');
    const dataToCheck = [];
    initData.sort()
    initData.forEach((val: any, key: string) => key !== 'hash' && dataToCheck.push(`${key}=${val}`));

    const secret = cryptoJS.HmacSHA256(this.telegramBotToken, 'WebAppData');
    const hashed = cryptoJS.HmacSHA256(dataToCheck.join('\n'), secret).toString(cryptoJS.enc.Hex);
    return hash === hashed;
  }
}

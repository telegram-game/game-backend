import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

@Injectable()
export class TelegramService {
  private readonly telegramBotToken: string;
  constructor(private configService: ConfigService) {
    this.telegramBotToken = this.configService.get<string>('telegramBotToken');
  }
  async verifyData(data: Record<string, any>, comparedHash: string): Promise<any> {
    // const dataCheckString = Object.keys(data).sort().map(key => `${key}=${data[key]}`).join('\n');
    const dataCheckString1 = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join("\n");
    // const dataCheckString = `user={"id":850598904,"first_name":"Phan","last_name":"Thọ","username":"tthophan","language_code":"en","is_premium":true,"photo_url":"https:\/\/t.me\/i\/userpic\/320\/yLz996VM9qOJ-aw-wr2dHVy92ELZHvJejC1XqJVohYI.svg"}&chat_instance=2354242654553342639&chat_type=supergroup&auth_date=1732104004&signature=mNn33lHrwVLazxuLUizWMjkVVZQI8_bNc6jryWb10clYJ7g5JPAbKY33PJ7lZPtc69VshVCtD1szGfmUiweKCg&hash=84f8154936bd6200e1a6ab93f04caaf52e51e0493940abd24ddb303dad15dffc`.replace(/&/g, '\n');
    // const dataCheckString = `user={"id":850598904,"first_name":"Phan","last_name":"Thọ","username":"tthophan","language_code":"en","is_premium":true,"photo_url":"https:\/\/t.me\/i\/userpic\/320\/yLz996VM9qOJ-aw-wr2dHVy92ELZHvJejC1XqJVohYI.svg"}&chat_instance=2354242654553342639&chat_type=supergroup&auth_date=1732104004&signature=mNn33lHrwVLazxuLUizWMjkVVZQI8_bNc6jryWb10clYJ7g5JPAbKY33PJ7lZPtc69VshVCtD1szGfmUiweKCg`.split('&').sort().join('\n');
    const dataCheckString = `user={"id":850598904,"first_name":"Phan","last_name":"Thọ","username":"tthophan","language_code":"en","is_premium":true,"photo_url":"https:\\/\\/t.me\\/i\\/userpic\\/320\\/yLz996VM9qOJ-aw-wr2dHVy92ELZHvJejC1XqJVohYI.svg"}&chat_instance=2354242654553342639&chat_type=supergroup&auth_date=1732104004&signature=mNn33lHrwVLazxuLUizWMjkVVZQI8_bNc6jryWb10clYJ7g5JPAbKY33PJ7lZPtc69VshVCtD1szGfmUiweKCg`.split('&').sort().join('\n');
    console.log('-----------------');
    console.log(dataCheckString1);
    console.log('-----------------');
    console.log('-----------------');
    console.log(dataCheckString);
    console.log('-----------------');
    // const hashed = hmac.update(this.telegramBotToken).digest('hex');
    const secretKey = createHmac("sha256", "WebAppData").update(this.telegramBotToken).digest("hex");
    // const hashed = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
    const hashed = createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");
    console.log(this.telegramBotToken, secretKey, hashed, comparedHash);
    return hashed === comparedHash;
  }
}

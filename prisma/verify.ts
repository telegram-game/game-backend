import { NestFactory } from '@nestjs/core';
import { Logger as LoggerService } from '../src/modules/loggers';
import { appProvider } from '../src/applications/app.provider';
import '../src/types/global.type'
import { TelegramService } from '../src/modules/shared/services/telegram.service';

async function bootstrap() {
    const app = await NestFactory.create(appProvider.getAppModule(), {
        cors: true,
        logger: new LoggerService(),
        rawBody: true,
    });

    const telegramService = app.get(TelegramService);
    const data = {
        // "user": {
        //     "id": 850598904,
        //     "first_name": "Phan",
        //     "last_name": "Thọ",
        //     "username": "tthophan",
        //     "language_code": "en",
        //     "is_premium": true,
        //     "photo_url": "https://t.me/i/userpic/320/yLz996VM9qOJ-aw-wr2dHVy92ELZHvJejC1XqJVohYI.svg"
        // },
        "user": `{"id":850598904,"first_name":"Phan","last_name":"Thọ","username":"tthophan","language_code":"en","is_premium":true,"photo_url":"https:\/\/t.me\/i\/userpic\/320\/yLz996VM9qOJ-aw-wr2dHVy92ELZHvJejC1XqJVohYI.svg"}`,
        "chat_instance": "3339665609949499161",
        "chat_type": "channel",
        "auth_date": "1732116073",
        "signature": "nqZMNuQrly5ZuU7dOJQJYHCApTVrspQ-qJr67dafMbAjrCzaCRsmFlBTyF3AST7VMCWOHnbjigbj4xi8S14oAw",
        // "hash": "2a2233a1d472a33327da5799fede1b38a9a1f5fc3ae7094bf2672af02630119d"
    };
    const hash = '2a2233a1d472a33327da5799fede1b38a9a1f5fc3ae7094bf2672af02630119d';
    // console.log(`user={"id":850598904,"first_name":"Phan","last_name":"Thọ","username":"tthophan","language_code":"en","is_premium":true,"photo_url":"https:\/\/t.me\/i\/userpic\/320\/yLz996VM9qOJ-aw-wr2dHVy92ELZHvJejC1XqJVohYI.svg"}&chat_instance=2354242654553342639&chat_type=supergroup&auth_date=1732104004&signature=mNn33lHrwVLazxuLUizWMjkVVZQI8_bNc6jryWb10clYJ7g5JPAbKY33PJ7lZPtc69VshVCtD1szGfmUiweKCg&hash=84f8154936bd6200e1a6ab93f04caaf52e51e0493940abd24ddb303dad15dffc`.replace(/&/g, '\n'));
    console.log('test', decodeURIComponent(decodeURIComponent('gWebAppData=user%3D%257B%2522id%2522%253A850598904%252C%2522first_name%2522%253A%2522Phan%2522%252C%2522last_name%2522%253A%2522Th%25E1%25BB%258D%2522%252C%2522username%2522%253A%2522tthophan%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522is_premium%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FyLz996VM9qOJ-aw-wr2dHVy92ELZHvJejC1XqJVohYI.svg%2522%257D%26chat_instance%3D2354242654553342639%26chat_type%3Dsupergroup%26auth_date%3D1732104004%26signature%3DmNn33lHrwVLazxuLUizWMjkVVZQI8_bNc6jryWb10clYJ7g5JPAbKY33PJ7lZPtc69VshVCtD1szGfmUiweKCg%26hash%3D84f8154936bd6200e1a6ab93f04caaf52e51e0493940abd24ddb303dad15dffc&tgWebAppVersion=7.10&tgWebAppPlatform=web&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23212121%22%2C%22button_color%22%3A%22%238774e1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23aaaaaa%22%2C%22link_color%22%3A%22%238774e1%22%2C%22secondary_bg_color%22%3A%22%23181818%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22header_bg_color%22%3A%22%23212121%22%2C%22accent_text_color%22%3A%22%238774e1%22%2C%22section_bg_color%22%3A%22%23212121%22%2C%22section_header_text_color%22%3A%22%238774e1%22%2C%22subtitle_text_color%22%3A%22%23aaaaaa%22%2C%22destructive_text_color%22%3A%22%23ff595a%22%7D')));
    const result = await telegramService.verifyData(data, hash);
    console.log(result, 'result');

}
bootstrap();

import { Injectable } from '@nestjs/common';
import { GameApiAppModule } from './app.module';

export type AppName = 'API' | 'LISTENER';

@Injectable()
export class AppProvider {
  public getAppModule(): GameApiAppModule {
    const appName: AppName = (process.env.APP_NAME || 'GAME_API') as AppName;
    return (
      {
        GAME_API: GameApiAppModule,
      }[appName] || GameApiAppModule
    );
  }
  public getAppName(): AppName {
    return (process.env.APP_NAME || 'GAME_API') as AppName;
  }
}

export const appProvider = new AppProvider();

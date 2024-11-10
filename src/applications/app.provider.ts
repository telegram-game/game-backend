import { Injectable } from '@nestjs/common';
import { ApiAppModule, ListenerAppModule } from './app.module';

export type AppName = 'API' | 'LISTENER';

@Injectable()
export class AppProvider {
  public getAppModule(): ApiAppModule | ListenerAppModule {
    const appName: AppName = (process.env.APP_NAME || 'API') as AppName;
    return (
      {
        API: ApiAppModule,
        LISTENER: ListenerAppModule,
      }[appName] || ApiAppModule
    );
  }
  public getAppName(): AppName {
    return (process.env.APP_NAME || 'API') as AppName;
  }
}

export const appProvider = new AppProvider();

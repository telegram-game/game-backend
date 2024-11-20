import { Module } from '@nestjs/common';
import { CoreAppModule } from './core-app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Environment, EnvironmentGameAPIVariables } from '../config/validation';
import configuration from '../config/configuration';
import { AppInformationModule } from '../modules/app-information';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/decorators/auth.guard';
import { SharedModule } from 'src/modules/shared/shared.module';
// import { CachingModule } from '../modules/caching/caching.module';
import { JwtModule } from '@nestjs/jwt';
import { GameModule } from 'src/modules/game';
import { AuthModule } from 'src/modules/auth';
import { MissionModule } from 'src/modules/mission';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: new EnvironmentGameAPIVariables(),
      validationOptions: {
        abortEarly: true,
        appName: 'GAME_API',
      },
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        const publicKey = configService.get<string>('jwtAccesstokenPublicKey');
        // const secret = publicKey
        //   ? Buffer.from(publicKey, 'base64').toString('ascii')
        //   : '';
        return {
          secret: publicKey,
        };
      },
      inject: [ConfigService],
    }),
    CoreAppModule.forRootAsync({
      useFactory: (configSerivce: ConfigService) => ({
        env: configSerivce.get<Environment>('env'),
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    // CachingModule,
    AppInformationModule,
    GameModule,
    AuthModule,
    MissionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class GameApiAppModule {}

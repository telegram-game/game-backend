import { Module } from '@nestjs/common';
import { CoreAppModule } from './core-app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  Environment,
  EnvironmentAPIVariables,
  EnvironmentListenerVariables,
} from '../config/validation';
import configuration from '../config/configuration';
import { AppInformationModule } from '../modules/app-information';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/decorators/auth.guard';
import { SharedModule } from 'src/modules/shared/shared.module';
import { CachingModule } from '../modules/caching/caching.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: new EnvironmentAPIVariables(),
      validationOptions: {
        abortEarly: true,
        appName: 'API',
      },
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        const publicKey = configService.get<string>('jwtPublicKey');
        const secret = publicKey
          ? Buffer.from(publicKey, 'base64').toString('ascii')
          : '';
        return {
          secret,
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
    AppInformationModule,
    SharedModule,
    CachingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ApiAppModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: new EnvironmentListenerVariables(),
      validationOptions: {
        abortEarly: true,
        appName: 'LISTENER',
      },
    }),
    CoreAppModule.forRootAsync({
      useFactory: (configSerivce: ConfigService) => ({
        env: configSerivce.get<Environment>('env'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        const publicKey = configService.get<string>('jwtPublicKey');
        const secret = publicKey
          ? Buffer.from(publicKey, 'base64').toString('ascii')
          : '';
        return {
          secret,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ListenerAppModule {}

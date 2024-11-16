import { LogLevel as NestLogLevel } from '@nestjs/common';
import { Environment } from './validation';

export type LogLevel = NestLogLevel | 'info';

export interface Configuration {
  appName: string;
  tz: string;
  port: number;
  env: Environment;
  logLevel: LogLevel;
  postGresUser: string;
  postGresPassword: string;
  postGresHost: string;
  postGresPort: number;
  postGresDb: string;
  redisHost: string;
  redisPort: number;
  redisMode: string;
  redisClusterNodes: string[];
  httpRequestTimeout: number;
  ignoreAuthGuard: boolean;
  jwtAccesstokenPrivateKey?: string;
  jwtAccesstokenPublicKey?: string;
  jwtRefreshtokenPrivateKey?: string;
  jwtRefreshtokenPublicKey?: string;
}

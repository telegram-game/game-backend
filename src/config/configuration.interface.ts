import { LogLevel as NestLogLevel } from '@nestjs/common';
import { Environment } from './validation';

export type LogLevel = NestLogLevel | 'info';

export interface Configuration {
  appName: string;
  tz: string;
  port: number;
  env: Environment;
  logLevel: LogLevel;
  isUneyGuardEnabled: boolean;
  isPresharedKeyEnabled: boolean;
  serverUrl: string;
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
  retryTimesWG: number;
  retryMultiplierWG: number;
  retryBaseWG: number;
  configManagerServicerUrl: string;
  removePeersBeforeSeconds: number;
  jwtPublicKey: string;
  removePeerRetryAttempts: number;
  removePeerRetryBackoff: number;
  blacklistRetryAttempts: number;
  blacklistRetryBackoff: number;
  getPeerInformationAssociatedDeepLevel: number;
  getPeerInformationAssociatedTimeRange: number;
  ignoreAuthGuard: boolean;
  rateLimit: {
    enabled: boolean;
    limit: number;
    timeWindow: number;
  };
  circuitBreaker: {
    enabled: boolean;
    successThreshold: number;
    failureThreshold: number;
    openToHalfOpenWaitTimeSeconds: number;
  };
  hmacSecret: string;
}

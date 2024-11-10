import { Configuration, LogLevel } from './configuration.interface';
import { Environment } from './validation';

export default (): Configuration => {
  process.env.DATABASE_URL = `postgresql://${encodeURIComponent(process.env.POSTGRESQL_USER)}:${encodeURIComponent(process.env.POSTGRESQL_PASSWORD)}@${process.env.POSTGRESQL_HOST}:${process.env.POSTGRESQL_PORT}/${process.env.POSTGRESQL_DB}`;
  const parseEnvInt = (value: string | undefined, fallback: number): number =>
    parseInt(value ?? fallback.toString());
  return {
    appName: process.env.APP_NAME,
    env: process.env.ENVIRONMENT as Environment,
    tz: process.env.TZ,
    port: parseEnvInt(process.env.PORT, 3000),
    logLevel: process.env.LOG_LEVEL as LogLevel,
    serverUrl: process.env.SERVER_URL,
    isUneyGuardEnabled: process.env.IS_UNEYGUARD_ENABLED === 'true' || false,
    isPresharedKeyEnabled:
      process.env.IS_PRESHARED_KEY_ENABLED === 'true' || false,
    postGresUser: process.env.POSTGRES_USER,
    postGresPassword: process.env.POSTGRES_PASSWORD,
    postGresHost: process.env.POSTGRES_HOST,
    postGresPort: parseInt(process.env.POSTGRES_PORT),
    postGresDb: process.env.POSTGRES_DB,
    redisHost: process.env.REDIS_HOST,
    redisPort: parseInt(process.env.REDIS_PORT),
    redisMode: process.env.REDIS_MODE || 'client',
    redisClusterNodes: process.env.REDIS_CLUSTER_NODES
      ? process.env.REDIS_CLUSTER_NODES.split(',')
      : [],
    httpRequestTimeout: parseEnvInt(process.env.HTTP_REQUEST_TIMEOUT, 10000),
    retryTimesWG: parseEnvInt(process.env.RETRY_TIMES_WG, 0),
    retryMultiplierWG: parseEnvInt(process.env.RETRY_MULTIPLIER_WG, 2),
    retryBaseWG: parseEnvInt(process.env.RETRY_BASE_WG, 10000),
    configManagerServicerUrl: process.env.CONFIG_MANAGER_SERVICE_URL,
    removePeersBeforeSeconds: parseEnvInt(
      process.env.REMOVE_PEERS_BEFORE_SECONDS,
      1800,
    ),
    jwtPublicKey: process.env.JWT_PUBLIC_KEY,
    removePeerRetryAttempts: parseEnvInt(
      process.env.REMOVE_PEER_RETRY_ATTEMPTS,
      3,
    ),
    removePeerRetryBackoff: parseEnvInt(
      process.env.REMOVE_PEER_RETRY_BACKOFF,
      5000,
    ),
    blacklistRetryAttempts: parseEnvInt(
      process.env.BLACKLIST_RETRY_ATTEMPTS,
      3,
    ),
    blacklistRetryBackoff: parseEnvInt(process.env.BLACKLIST_RETRY_BACKOFF, 30),
    getPeerInformationAssociatedDeepLevel: parseEnvInt(
      process.env.GET_PEER_INFORMATION_ASSOCIATED_DEEP_LEVEL,
      3,
    ),
    getPeerInformationAssociatedTimeRange: parseEnvInt(
      process.env.GET_PEER_INFORMATION_ASSOCIATED_TIME_RANGE,
      30,
    ),
    ignoreAuthGuard: process.env.IGNORE_AUTH_GUARD
      ? process.env.IGNORE_AUTH_GUARD === 'true'
      : true, // default true
    rateLimit: {
      enabled: /^true$/i.test(process.env.RATE_LIMIT_ENABLED || 'false'),
      limit: parseInt(process.env.RATE_LIMIT || '100'),
      timeWindow: parseInt(process.env.RATE_LIMIT_TIME_WINDOW || '1000'),
    },
    circuitBreaker: {
      enabled: /^true$/i.test(process.env.CIRCUIT_BREAKER_ENABLED || 'false'),
      successThreshold: parseInt(
        process.env.CIRCUIT_BREAKER_SUCCESS_THRESHOLD || '10', // 10 requests
      ),
      failureThreshold: parseInt(
        process.env.CIRCUIT_BREAKER_FAILURE_THRESHOLD || '50', // 50 requests
      ),
      openToHalfOpenWaitTimeSeconds: parseInt(
        process.env.CIRCUIT_BREAKER_OPEN_TO_HALF_OPEN_WAIT_TIME || '60', // 1 minute
      ),
    },
    hmacSecret: process.env.HMAC_SECRET,
  };
};

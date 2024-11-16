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
    postGresUser: process.env.POSTGRESQL_USER,
    postGresPassword: process.env.POSTGRESQL_PASSWORD,
    postGresHost: process.env.POSTGRESQL_HOST,
    postGresPort: parseInt(process.env.POSTGRESQL_PORT),
    postGresDb: process.env.POSTGRESQL_DB,
    redisHost: process.env.REDIS_HOST,
    redisPort: parseInt(process.env.REDIS_PORT),
    redisMode: process.env.REDIS_MODE || 'client',
    redisClusterNodes: process.env.REDIS_CLUSTER_NODES
      ? process.env.REDIS_CLUSTER_NODES.split(',')
      : [],
    httpRequestTimeout: parseEnvInt(process.env.HTTP_REQUEST_TIMEOUT, 10000),
    ignoreAuthGuard: (process.env.IGNORE_AUTH_GUARD || 'true') === 'true',
    jwtAccesstokenPrivateKey: process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
    jwtAccesstokenPublicKey: process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY,
    jwtRefreshtokenPrivateKey: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
    jwtRefreshtokenPublicKey: process.env.JWT_REFRESH_TOKEN_PUBLIC_KEY,
  };
};

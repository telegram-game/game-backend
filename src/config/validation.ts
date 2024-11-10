import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum Environment {
  Local = 'local',
  Development = 'development',
  QA = 'qa',
  Staging = 'staging',
  Production = 'production',
}

export class EnvironmentAPIVariables {
  @IsString()
  TZ: string;

  @IsEnum(Environment)
  ENVIRONMENT: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  POSTGRESQL_USER: string;

  @IsString()
  POSTGRESQL_PASSWORD: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  POSTGRESQL_PORT: number;

  @IsString()
  POSTGRESQL_HOST: string;

  @IsString()
  POSTGRESQL_DB: string;

  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  REDIS_PORT: number;

  @IsString()
  REDIS_MODE: string;

  HTTP_REQUEST_TIMEOUT: number;

  RETRY_TIMES_WG: number;

  RETRY_MULTIPLIER_WG: number;

  RETRY_BASE_WG: number;

  SERVER_URL: string;

  @IsString()
  @IsOptional()
  JWT_PUBLIC_KEY: string;

  @IsString()
  HMAC_SECRET: string;

  validate(config: Record<string, unknown>, options: Record<string, unknown>) {
    if (options.appName !== (process.env.APP_NAME || 'API')) {
      return {};
    }

    const validatedConfig = plainToInstance(EnvironmentAPIVariables, config, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      const message = errors
        .flatMap(({ constraints }) =>
          Object.keys(constraints).flatMap((key) => constraints[key]),
        )
        .join('\n');
      console.error(`ENV Missing:\n${message}`);
      return {
        error: message,
      };
    }
    return { validatedConfig };
  }
}

export class EnvironmentListenerVariables {
  @IsString()
  TZ: string;

  @IsEnum(Environment)
  ENVIRONMENT: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  CONFIG_MANAGER_SERVICE_URL: string;

  @IsString()
  @IsOptional()
  JWT_PUBLIC_KEY: string;

  validate(
    config: Record<string, unknown>,
    { appName }: Record<string, unknown>,
  ) {
    if (appName !== (process.env.APP_NAME || 'API')) {
      return {};
    }
    const validatedConfig = plainToInstance(
      EnvironmentListenerVariables,
      config,
      {
        enableImplicitConversion: true,
      },
    );
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      const message = errors
        .flatMap(({ constraints }) =>
          Object.keys(constraints).flatMap((key) => constraints[key]),
        )
        .join('\n');
      console.error(`ENV Missing:\n${message}`);
      return {
        error: message,
      };
    }
    return { validatedConfig };
  }
}

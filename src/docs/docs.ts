import { CustomErrorResponse } from './api-custom.dto';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ParameterObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ConfigService } from '@nestjs/config';
import {
  CID_HEADER_KEY,
  DEVICE_ID_HEADER_KEY,
  LANGUAGE_CODE_HEADER_KEY,
} from 'src/constants';

export function setupSwagger(
  app: INestApplication,
  configService: ConfigService<unknown, boolean>,
) {
  const options = new DocumentBuilder()
    .setTitle('Live VPN Config Manager API')
    .setDescription(
      'The Live VPN Config Manager APIs support for configuration Live VPN ',
    )
    .setVersion('1.0')
    .addServer('', 'Local server')
    .addServer(configService.get<string>('serverUrl'), 'Development server')
    .addGlobalParameters(...buildHeaderObject())
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    extraModels: [CustomErrorResponse],
  });
  SwaggerModule.setup('api/docs', app, document);
}

function buildHeaderObject(): ParameterObject[] {
  return [
    {
      in: 'header',
      required: false,
      name: DEVICE_ID_HEADER_KEY,
      schema: {
        example: 'device-id',
      },
    },
    {
      in: 'header',
      required: false,
      name: LANGUAGE_CODE_HEADER_KEY,
      schema: {
        example: 'en',
      },
    },
    {
      in: 'header',
      required: false,
      name: CID_HEADER_KEY,
      schema: {
        example: 'cid',
      },
    },
  ];
}

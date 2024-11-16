import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import {
  AUTHORIZATION,
  CID_HEADER_KEY,
  DEVICE_ID_HEADER_KEY,
  LANGUAGE_CODE_HEADER_KEY,
  SERVER_LANGUAGE,
} from 'src/constants';
import { RequestContext } from 'src/models';
import { Logger } from 'src/modules/loggers';
import asyncLocalStorage from 'src/storage/async_local';
import { generateCID } from 'src/utils';
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestContextMiddleware.name);
  use(request: Request, _: Response, next: NextFunction) {
    let cid =
      request.header(CID_HEADER_KEY) ||
      request.header(CID_HEADER_KEY.toUpperCase());
    const deviceId =
      request.header(DEVICE_ID_HEADER_KEY) ||
      request.header(DEVICE_ID_HEADER_KEY.toUpperCase());
    const lang =
      request.header(LANGUAGE_CODE_HEADER_KEY) ||
      request.header(LANGUAGE_CODE_HEADER_KEY.toUpperCase());

    if (!cid) {
      cid = generateCID(cid);
      this.logger.warn(
        `Request missing cid header, generating cid [${cid}] for request`,
      );
    }
    request.context = new RequestContext({
      cid,
      deviceId,
      lang,
      requestTimestamp: this.getTimestamp(),
    });

    const validLanguages = new Set(Object.values(SERVER_LANGUAGE));

    if (!validLanguages.has(request.context.lang)) {
      request.context.lang = SERVER_LANGUAGE.en;
    }

    const accessToken =
      request.header(AUTHORIZATION) ||
      request.header(AUTHORIZATION.toUpperCase());
    if (accessToken) {
      try {
        const token = accessToken.split(' ')[1];
        const userInfo = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString(),
        );
        request.context.userInfo = {
          userId: userInfo?.userId,
          deviceId: userInfo?.uniqueDeviceId,
        };

        if (userInfo?.uniqueDeviceId) {
          request.context.deviceId = userInfo.uniqueDeviceId;
        }
      } catch (error) {
        this.logger.warn(
          'Error parsing user info',
          error,
          this.constructor.name,
        );
      }
    }

    asyncLocalStorage.run(request.context, () => next());
  }

  getTimestamp = () => new Date().getTime();
}

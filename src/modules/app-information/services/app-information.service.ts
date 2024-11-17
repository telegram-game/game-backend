import { AppInformationResponse } from '../models/app-information.model.dto';
import { Injectable } from '@nestjs/common';
import { version } from '../../../../package.json';
import { configurationData } from '../../../data';

@Injectable()
export class AppInformationService {
  constructor() {}

  async getAppInformation(): Promise<AppInformationResponse> {
    return {
      ...configurationData,
      version,
    } as AppInformationResponse;
  }
}

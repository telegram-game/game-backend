import { AppInformationResponse } from '../models/app-information.model.dto';
import { Injectable } from '@nestjs/common';
import houseData from '../../../data/house.json';
import itemData from '../../../data/item.json';
import systemData from '../../../data/system.json';
import { version } from '../../../../package.json';

@Injectable()
export class AppInformationService {
  constructor() {}

  async getAppInformation(): Promise<AppInformationResponse> {
    return {
      houseData,
      itemData,
      systemData,
      version,
    } as AppInformationResponse;
  }
}

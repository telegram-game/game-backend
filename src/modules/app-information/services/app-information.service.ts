import {
  AppInformationResponse,
} from '../models/app-information.model.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppInformationService {
  constructor(
  ) {}

  async getAppInformation(
  ): Promise<AppInformationResponse> {
    return {} as AppInformationResponse;
  }
}

import { Controller, Get } from '@nestjs/common';
import { AppInformationService } from '../services/app-information.service';
import {
  AppInformationResponse,
} from '../models/app-information.model.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  BadRequestResponse,
  InternalServerErrorResponse,
} from 'src/docs/api-custom.dto';
import { NotRequireAuthentication } from 'src/decorators';

@ApiInternalServerErrorResponse(InternalServerErrorResponse())
@ApiBadRequestResponse(BadRequestResponse())
@Controller({
  path: ['/api/v1.0/app/information'],
  version: ['1.0'],
})
export class AppInformationController {
  constructor(private appInformationService: AppInformationService) {}

  @Get()
  @NotRequireAuthentication()
  async get(): Promise<AppInformationResponse> {
    // todo
    return this.appInformationService.getAppInformation();
  }
}

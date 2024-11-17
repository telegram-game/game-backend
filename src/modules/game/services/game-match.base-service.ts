import { Injectable } from '@nestjs/common';
import { SupportService } from 'src/modules/shared/services/support.service';

@Injectable()
export class BaseGameMatchService {
  constructor(protected readonly supportService: SupportService) {}
}

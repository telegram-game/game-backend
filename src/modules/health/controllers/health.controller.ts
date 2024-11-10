import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { NotRequireAuthentication } from 'src/decorators/auth.guard';

@Controller({
  path: 'healthcheck',
  version: VERSION_NEUTRAL,
})
export class HealthController {
  @NotRequireAuthentication()
  @Get()
  async check(): Promise<string> {
    return 'ok';
  }
}

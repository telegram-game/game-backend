import { Controller, Get } from '@nestjs/common';
import { HeroService } from '../services/hero.service';
import { FullHero } from '../models/hero.model.dto';

@Controller({
  path: ['/api/v1.0/app/information'],
  version: ['1.0'],
})
export class HeroController {
  constructor(private heroService: HeroService) {}

  @Get()
  async getFirst(): Promise<FullHero> {
    // todo
    return this.heroService.getFirst();
  }
}

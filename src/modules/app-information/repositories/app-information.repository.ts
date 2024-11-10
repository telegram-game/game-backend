import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { BaseRepository } from 'src/modules/prisma/base/base.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class AppInformationRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }
}

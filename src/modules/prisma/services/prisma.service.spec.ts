import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';

describe('PrismaService', () => {
  let prismaService: PrismaService;
  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('should connect to the database', async () => {
    jest
      .spyOn(PrismaClient.prototype, '$connect')
      .mockImplementationOnce(async () => {
        return Promise.resolve();
      });
    await prismaService.onModuleInit();
    expect(prismaService).toBeTruthy();
  });

  it('should disconnect to the database', async () => {
    jest
      .spyOn(PrismaClient.prototype, '$disconnect')
      .mockImplementationOnce(async () => {
        return Promise.resolve();
      });
    await prismaService.onModuleDestroy();
    expect(prismaService).toBeTruthy();
  });
});

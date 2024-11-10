import { BaseRepository } from './base.repository';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../services';
import { Test } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';

@Injectable()
class MockRepository extends BaseRepository {
  constructor(prismaService: PrismaService) {
    super(prismaService);
  }
}
describe('BaseRepository', () => {
  let mockRepository: MockRepository;
  let prismaService = {};

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        MockRepository,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService) as any;
    mockRepository = await moduleRef.resolve<MockRepository>(MockRepository);
  });

  it('should create an instance of BaseRepository', () => {
    expect(mockRepository).toBeInstanceOf(BaseRepository);
  });

  it('should join a transaction', () => {
    const mockPrismaClient = new PrismaClient();
    mockRepository.joinTransaction(mockPrismaClient);
    expect(mockRepository['client']).toBe(mockPrismaClient);
  });

  it('should leave a transaction', () => {
    const mockPrismaClient = new PrismaClient();
    mockRepository.joinTransaction(mockPrismaClient);
    mockRepository.leftTransaction();
    expect(mockRepository['client']).toBe(prismaService);
  });
});

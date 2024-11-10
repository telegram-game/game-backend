import { Test, TestingModule } from '@nestjs/testing';
import { AppInformationRepository } from './app-information.repository';
import { PrismaService } from 'src/modules/prisma';
import { AppInformationType } from '@prisma/client';

describe('AppInformationRepository', () => {
  let repository: AppInformationRepository;
  let prismaService = {
    appInformation: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AppInformationRepository,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();
    prismaService = moduleRef.get<PrismaService>(PrismaService) as any;
    repository = await moduleRef.resolve<AppInformationRepository>(
      AppInformationRepository,
    );
  });

  describe('getAppInformation', () => {
    it('should return all app information when no types are specified', async () => {
      const types = undefined;
      const expectedAppInformation: any = {
        faqs: {
          contentEN: {
            answer: 'string2',
            question: 'string2',
          },
          contentVI: {
            answer: 'string1',
            question: 'string1',
          },
        },
        termOfUse: {
          contentEN: 'string',
          contentVI: 'string',
        },
      };
      prismaService.appInformation.findMany.mockResolvedValue(
        expectedAppInformation,
      );
      const result = await repository.getAppInformation(types);

      expect(prismaService.appInformation.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.appInformation.findMany).toHaveBeenCalledWith({
        where: {
          type: types,
        },
      });

      expect(result).toEqual(expectedAppInformation);
    });

    it('should return app information of specified types', async () => {
      const typesSpecific = [AppInformationType.TERM_OF_USE];
      const expectedAppInformation: any = {
        termOfUse: {
          contentEN: 'string',
          contentVI: 'string',
        },
      };

      prismaService.appInformation.findMany.mockResolvedValue(
        expectedAppInformation,
      );

      const result = await repository.getAppInformation(typesSpecific);

      expect(prismaService.appInformation.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.appInformation.findMany).toHaveBeenCalledWith({
        where: {
          type: {
            in: typesSpecific,
          },
        },
      });

      expect(result).toEqual(expectedAppInformation);
    });

    it('should throw error as expected', async () => {
      const err = new Error('error');
      prismaService.appInformation.findMany.mockRejectedValue(err);

      try {
        await repository.getAppInformation();
        fail('should throw error');
      } catch (error) {
        expect(error).toEqual(err);
      }
    });
  });
});

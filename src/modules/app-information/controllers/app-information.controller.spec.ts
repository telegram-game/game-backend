import { AppInformationController } from './app-information.controller';
import { AppInformationService } from '../services/app-information.service';
import { Test } from '@nestjs/testing';

describe('AppInformationController', () => {
  let appInformationController: AppInformationController;
  let appInformationService = {
    getAppInformation: jest.fn(),
  };
  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [AppInformationController],
      providers: [
        {
          provide: AppInformationService,
          useValue: appInformationService,
        },
      ],
    }).compile();

    appInformationService = moduleRef.get<AppInformationService>(
      AppInformationService,
    ) as any;
    appInformationController = moduleRef.get<AppInformationController>(
      AppInformationController,
    );
  });

  describe('getAppInformation', () => {
    it('should return the app information', async () => {
      const mockAppInformation: any = {
        termOfUse: {
          contentEN: 'string',
          contentVI: 'string',
        },
      };

      appInformationService.getAppInformation.mockResolvedValue(
        mockAppInformation,
      );

      const result = await appInformationController.get({});

      expect(appInformationService.getAppInformation).toHaveBeenCalledTimes(1);
      expect(appInformationService.getAppInformation).toHaveBeenCalledWith(
        undefined,
      );
      expect(result).toEqual(mockAppInformation);
    });
  });
  it('should throw error as expected', async () => {
    const err = new Error('error');
    appInformationService.getAppInformation.mockRejectedValue(err);
    try {
      await appInformationController.get({});
      fail('should throw error');
    } catch (error) {
      expect(error).toEqual(err);
    }
  });
});

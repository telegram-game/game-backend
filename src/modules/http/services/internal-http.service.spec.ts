import { Test } from '@nestjs/testing';
import { InternalHttpClientService } from './internal-http.service';
import { REQUEST } from '@nestjs/core';
import {
  AUTHORIZATION,
  CID_HEADER_KEY,
  CONTENT_TYPE_HEADER_KEY,
  DEVICE_ID_HEADER_KEY,
  LANGUAGE_CODE_HEADER_KEY,
} from 'src/constants';
import { AxiosError, AxiosResponse } from 'axios';
import { BusinessException } from 'src/exceptions';

describe('InternalHttpClientService', () => {
  let internalHttpClientService: InternalHttpClientService;
  const request = {
    context: {
      cid: 'cid',
      accesstoken: 'Bearer token',
      deviceId: 'device-id',
      lang: 'en',
    },
  };
  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        InternalHttpClientService,
        {
          provide: REQUEST,
          useValue: request,
        },
      ],
    }).compile();

    internalHttpClientService = moduleRef.get<InternalHttpClientService>(
      InternalHttpClientService,
    );
  });

  describe('buildHeaders', () => {
    it('should build headers correctly', () => {
      const headers = {
        'custom-header': 'value',
      };
      const result = internalHttpClientService['buildHeaders'](headers);
      expect(result.get(CONTENT_TYPE_HEADER_KEY)).toEqual('application/json');
      expect(result.get(CID_HEADER_KEY)).toEqual(request.context.cid);
      expect(result.get(AUTHORIZATION)).toEqual(request.context.accesstoken);
      expect(result.get(DEVICE_ID_HEADER_KEY)).toEqual(
        request.context.deviceId,
      );
      expect(result.get(LANGUAGE_CODE_HEADER_KEY)).toEqual(
        request.context.lang,
      );
      expect(result.get('custom-header')).toEqual('value');
    });
  });
  describe('handleResponse', () => {
    it('should return response data if response is successful', () => {
      const res: AxiosResponse<object> = {
        data: {
          data: 'success',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      const result = internalHttpClientService['handleResponse'](res);
      expect(result).toEqual(res.data['data']);
    });

    it('should throw BusinessException if response is an error', () => {
      const error: AxiosError = {
        response: {
          data: {
            title: 'Bad Request',
            detail: 'Error',
          },
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: {
            headers: undefined,
          },
        },
        config: {
          headers: undefined,
        },
        isAxiosError: true,
        name: 'Error',
        message: 'Error',
        toJSON: () => ({}),
      };

      const exceptedError = new BusinessException({
        errorCode: 'Bad Request',
        status: 400,
        errorMessage: 'Error',
      });
      try {
        internalHttpClientService['handleResponse'](error);
        fail('should throw error');
      } catch (error) {
        expect(error).toEqual(exceptedError);
      }
    });
  });
});

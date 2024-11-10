import { Test } from '@nestjs/testing';
import { HttpClientService } from './http-client.service';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import axios, { AxiosHeaders } from 'axios';

jest.mock('axios');

class MockHttpClientService extends HttpClientService {
  constructor(@Inject(REQUEST) request) {
    super({ timeout: 1000 }, request);
  }

  protected override buildHeaders(
    headers: Record<string, string> | AxiosHeaders,
  ): AxiosHeaders {
    return new AxiosHeaders(headers);
  }

  protected override handleResponse<T>(res: any): T {
    return res;
  }
}
describe('HttpClientService', () => {
  let mockHttpClientService: MockHttpClientService;
  const request = {
    context: {
      cid: 'cid',
      accesstoken: 'Bearer token',
      deviceId: 'device-id',
      lang: 'en',
    },
  };
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  (axios.create as jest.Mock).mockReturnValue(mockedAxios);

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        MockHttpClientService,
        {
          provide: REQUEST,
          useValue: request,
        },
      ],
    }).compile();

    mockHttpClientService = moduleRef.get<MockHttpClientService>(
      MockHttpClientService,
    );
  });

  describe('get', () => {
    it('should make a GET request and return the response', async () => {
      const url = 'https://api.example.com/users';
      const params = { page: '1', limit: '10' };
      const headers = { Authorization: 'Bearer token' };
      const expectedResponse = { data: 'success' };

      mockedAxios.get.mockResolvedValue(expectedResponse);

      const response = await mockHttpClientService.get(url, params, headers);
      expect(response).toEqual(expectedResponse);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith(url, {
        headers: mockHttpClientService['buildHeaders'](headers),
        params,
      });
    });
    it('should make a GET request and return err', async () => {
      const url = 'https://api.example.com/users';
      const params = { page: '1', limit: '10' };
      const headers = { Authorization: 'Bearer token' };
      const err = new Error('error');

      mockedAxios.get.mockRejectedValue(err);
      const response = await mockHttpClientService.get(url, params, headers);
      expect(response).toEqual(err);
    });
  });
  describe('post', () => {
    it('should make a POST request and return the response', async () => {
      const url = 'https://api.example.com/users';
      const data = { name: 'John Doe', email: 'john@example.com' };
      const headers = { Authorization: 'Bearer token' };

      mockedAxios.post.mockResolvedValue(data);
      const response = await mockHttpClientService.post(url, data, headers);

      expect(response).toEqual(data);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(url, data, {
        headers: mockHttpClientService['buildHeaders'](headers),
      });
    });
    it('should make a POST request and return err', async () => {
      const url = 'https://api.example.com/users';
      const data = { name: 'John Doe', email: 'john@example.com' };
      const headers = { Authorization: 'Bearer token' };
      const err = new Error('error');
      mockedAxios.post.mockRejectedValue(err);
      const response = await mockHttpClientService.post(url, data, headers);
      expect(response).toEqual(err);
    });
  });
  describe('put', () => {
    it('should make a PUT request and return the response', async () => {
      const url = 'https://api.example.com/users';
      const data = { name: 'John Doe', email: 'john@example.com' };
      const headers = { Authorization: 'Bearer token' };

      mockedAxios.put.mockResolvedValue(data);
      const response = await mockHttpClientService.put(url, data, headers);
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
      expect(mockedAxios.put).toHaveBeenCalledWith(url, data, {
        headers: mockHttpClientService['buildHeaders'](headers),
      });
      expect(response).toEqual(data);
    });
    it('should make a PUT request and return err', async () => {
      const url = 'https://api.example.com/users';
      const data = { name: 'John Doe', email: 'john@example.com' };
      const headers = { Authorization: 'Bearer token' };
      const err = new Error('error');
      mockedAxios.put.mockRejectedValue(err);
      const response = await mockHttpClientService.put(url, data, headers);
      expect(response).toEqual(err);
    });
  });
  describe('delete', () => {
    it('should make a DELETE request and return the response', async () => {
      const url = 'https://api.example.com/users';
      const params = { name: 'John Doe', email: 'john@example.com' };
      const headers = { Authorization: 'Bearer token' };
      const data = { name: 'John Doe' };

      mockedAxios.delete.mockResolvedValue(data);
      const response = await mockHttpClientService.delete(
        url,
        params,
        data,
        headers,
      );
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
      expect(mockedAxios.delete).toHaveBeenCalledWith(url, {
        headers: mockHttpClientService['buildHeaders'](headers),
        params,
        data,
      });
      expect(response).toEqual(data);
    });
    it('should make a DELETE request and return err', async () => {
      const url = 'https://api.example.com/users';
      const params = { name: 'John Doe', email: 'john@example.com' };
      const headers = { Authorization: 'Bearer token' };
      const data = { name: 'John Doe' };
      const err = new Error('error');
      mockedAxios.delete.mockRejectedValue(err);
      const response = await mockHttpClientService.delete(
        url,
        params,
        data,
        headers,
      );
      expect(response).toEqual(err);
    });
  });
  describe('patch', () => {
    it('should make a PATCH request and return the response', async () => {
      const url = 'https://api.example.com/users';
      const data = { name: 'John Doe', email: 'john@example.com' };
      const headers = { Authorization: 'Bearer token' };

      mockedAxios.patch.mockResolvedValue(data);
      const response = await mockHttpClientService.patch(url, data, headers);
      expect(mockedAxios.patch).toHaveBeenCalledTimes(1);
      expect(mockedAxios.patch).toHaveBeenCalledWith(url, data, {
        headers: mockHttpClientService['buildHeaders'](headers),
      });
      expect(response).toEqual(data);
      // Add more assertions to validate the response
    });
    it('should make a PATCH request and return err', async () => {
      const url = 'https://api.example.com/users';
      const data = { name: 'John Doe', email: 'john@example.com' };
      const headers = { Authorization: 'Bearer token' };
      const err = new Error('error');
      mockedAxios.patch.mockRejectedValue(err);
      const response = await mockHttpClientService.patch(url, data, headers);
      expect(response).toEqual(err);
    });
  });
  describe('forward', () => {
    it('should make a FORWARD request and return the response', async () => {
      const url = 'https://api.example.com/users';
      const data = { name: 'John Doe', email: 'john@example.com' };
      const headers = { Authorization: 'Bearer token' };

      mockedAxios.request.mockResolvedValue(data);
      const response = await mockHttpClientService.forward(
        url,
        'get',
        null,
        null,
        headers,
      );

      expect(response).toEqual(data);
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request).toHaveBeenCalledWith({
        url: url,
        method: 'get',
        headers: mockHttpClientService['buildHeaders'](headers),
        params: null,
        data: {},
      });
    });
    it('should make a FORWARD request and return err', async () => {
      const url = 'https://api.example.com/users';
      const headers = { Authorization: 'Bearer token' };
      const err = new Error('error');
      mockedAxios.request.mockRejectedValue(err);
      const response = await mockHttpClientService.forward(
        url,
        'get',
        null,
        null,
        headers,
      );
      expect(response).toEqual(err);
    });
  });
  describe('forwardFromRequest', () => {
    it('should make a FORWARD FROM REQUEST request and return the response', async () => {
      const url = 'https://api.example.com/users';
      const data = { name: 'John Doe', email: 'john@example.com' };
      const headers = { Authorization: 'Bearer token' };

      mockedAxios.request.mockResolvedValue(data);
      const response = await mockHttpClientService.forwardFromRequest(
        url,
        'get',
        headers,
      );

      expect(response).toEqual(data);
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request).toHaveBeenCalledWith({
        url: url,
        method: 'get',
        headers: mockHttpClientService['buildHeaders'](headers),
      });
    });
  });
});

/**
 * @file api.test.ts
 * @remarks API 模块单元测试
 * @author ickeep <i@ickeep.com>
 * @module @yimoka/store
 */

import { describe, it, expect, vi } from 'vitest';

import { runAPI } from '../api';

describe('API 模块', () => {
  describe('runAPI', () => {
    it('应该正确处理 API 函数', async () => {
      const mockResponse = { code: 200, data: { name: 'test' } };
      const mockApi = vi.fn().mockResolvedValue(mockResponse);
      const mockExecutor = vi.fn();
      const result = await runAPI(mockApi, mockExecutor);
      expect(result).toBe(mockResponse);
      expect(mockApi).toHaveBeenCalled();
      expect(mockExecutor).not.toHaveBeenCalled();
    });

    it('应该正确处理 GET 请求', async () => {
      const mockResponse = { code: 200, data: { name: 'test' } };
      const mockApi = { url: '/api/test', method: 'GET', params: {} };
      const mockExecutor = vi.fn().mockResolvedValue(mockResponse);
      const result = await runAPI(mockApi, mockExecutor);
      expect(result).toBe(mockResponse);
      expect(mockExecutor).toHaveBeenCalledWith({
        url: '/api/test',
        method: 'GET',
        params: {},
      });
    });

    it('应该正确处理 POST 请求', async () => {
      const mockResponse = { code: 200, data: { name: 'test' } };
      const mockApi = { url: '/api/test', method: 'POST', data: { name: 'test' } };
      const mockExecutor = vi.fn().mockResolvedValue(mockResponse);
      const result = await runAPI(mockApi, mockExecutor);
      expect(result).toBe(mockResponse);
      expect(mockExecutor).toHaveBeenCalledWith({
        url: '/api/test',
        method: 'POST',
        data: { name: 'test' },
      });
    });

    it('应该正确处理 PUT 请求', async () => {
      const mockResponse = { code: 200, data: { name: 'test' } };
      const mockApi = { url: '/api/test', method: 'PUT', data: { name: 'test' } };
      const mockExecutor = vi.fn().mockResolvedValue(mockResponse);
      const result = await runAPI(mockApi, mockExecutor);
      expect(result).toBe(mockResponse);
      expect(mockExecutor).toHaveBeenCalledWith({
        url: '/api/test',
        method: 'PUT',
        data: { name: 'test' },
      });
    });

    it('应该正确处理 PATCH 请求', async () => {
      const mockResponse = { code: 200, data: { name: 'test' } };
      const mockApi = { url: '/api/test', method: 'PATCH', data: { name: 'test' } };
      const mockExecutor = vi.fn().mockResolvedValue(mockResponse);
      const result = await runAPI(mockApi, mockExecutor);
      expect(result).toBe(mockResponse);
      expect(mockExecutor).toHaveBeenCalledWith({
        url: '/api/test',
        method: 'PATCH',
        data: { name: 'test' },
      });
    });

    it('应该正确处理请求取消', async () => {
      const mockResponse = { code: 200, data: { name: 'test' } };
      const mockApi = { url: '/api/test', method: 'GET', params: {} };
      const mockExecutor = vi.fn().mockResolvedValue(mockResponse);
      const abortController = new AbortController();
      const result = await runAPI(mockApi, mockExecutor, undefined, abortController);
      expect(result).toBe(mockResponse);
      expect(mockExecutor).toHaveBeenCalledWith({
        url: '/api/test',
        method: 'GET',
        params: {},
        signal: abortController.signal,
      });
    });

    it('应该正确处理缺少 API 配置和执行器的情况', async () => {
      const result = await runAPI(undefined, undefined);
      expect(result).toEqual({
        code: 400,
        data: '',
        msg: 'api / apiExecutor is required',
      });
    });

    it('应该正确处理 API 执行器错误', async () => {
      const mockError = new Error('API Error');
      const mockApi = { url: '/api/test', method: 'GET', params: {} };
      const mockExecutor = vi.fn().mockRejectedValue(mockError);
      try {
        await runAPI(mockApi, mockExecutor);
      } catch (error) {
        expect(error).toBe(mockError);
      }
    });
  });
});


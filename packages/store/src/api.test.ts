import { IAPIRequestConfig } from '@yimoka/shared';
import { describe, it, expect, vi } from 'vitest';

import { runAPI } from './api';

describe('runStoreAPI', () => {
  it('should return error if api is not provided', async () => {
    const result = await runAPI();
    expect(result).toEqual({ code: 400, data: '', msg: 'api / apiExecutor is required' });
  });

  it('should execute api function if provided', async () => {
    const apiFunction = vi.fn().mockResolvedValue({ success: true, data: { key: 'value' } });
    const result = await runAPI(apiFunction, undefined, { key: 'value' });
    expect(apiFunction).toHaveBeenCalledWith({ key: 'value' });
    expect(result).toEqual({ success: true, data: { key: 'value' } });
  });

  it('should return error if apiExecutor is not provided for api config', async () => {
    const apiConfig: IAPIRequestConfig = { method: 'GET', url: '/api/data' };
    const result = await runAPI(apiConfig);
    expect(result).toEqual({ code: 400, data: '', msg: 'api / apiExecutor is required' });
  });

  it('should execute apiExecutor with merged config for GET method', async () => {
    const apiConfig: IAPIRequestConfig = { method: 'GET', url: '/api/data', params: { id: 1 } };
    const apiExecutor = vi.fn().mockResolvedValue({ success: true, config: apiConfig });
    const result = await runAPI(apiConfig, apiExecutor, { extraParam: 'value' });
    expect(apiExecutor).toHaveBeenCalledWith({
      method: 'GET',
      url: '/api/data',
      params: { id: 1, extraParam: 'value' },
    });
    expect(result).toEqual({ success: true, config: apiConfig });
  });

  it('should execute apiExecutor with merged config for POST method', async () => {
    const apiConfig: IAPIRequestConfig = { method: 'POST', url: '/api/data', data: { id: 1 } };
    const apiExecutor = vi.fn().mockResolvedValue({ success: true, config: apiConfig });
    const result = await runAPI(apiConfig, apiExecutor, { extraParam: 'value' });
    expect(apiExecutor).toHaveBeenCalledWith({
      method: 'POST',
      url: '/api/data',
      data: { id: 1, extraParam: 'value' },
    });
    expect(result).toEqual({ success: true, config: apiConfig });
  });

  it('should include abort signal in config if abortController is provided', async () => {
    const apiConfig: IAPIRequestConfig = { method: 'GET', url: '/api/data' };
    const apiExecutor = vi.fn().mockResolvedValue({ success: true, config: apiConfig });
    const abortController = new AbortController();
    const result = await runAPI(apiConfig, apiExecutor, undefined, abortController);
    expect(apiExecutor).toHaveBeenCalledWith({
      method: 'GET',
      url: '/api/data',
      params: {},
      signal: abortController.signal,
    });
    expect(result).toEqual({ success: true, config: apiConfig });
  });
});

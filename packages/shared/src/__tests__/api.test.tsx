import { describe, it, expect } from 'vitest';

import { isSuccess, isUnauthorized, isForbidden, isNetworkError, getCodeByStatus, isBadRequest, isTryCatchError, getTryCatchErrorResponse } from '../api';

describe('API 状态检查', () => {
  it('应正确判断成功状态', () => {
    expect(isSuccess({ code: 0 })).toBeTruthy();
    expect(isSuccess({ code: 1 })).toBeFalsy();
    expect(isSuccess({})).toBeFalsy();
  });

  it('应正确判断未授权状态', () => {
    expect(isUnauthorized({ code: 401 })).toBeTruthy();
    expect(isUnauthorized({ code: 402 })).toBeFalsy();
    expect(isUnauthorized({})).toBeFalsy();
  });

  it('应正确判断认证失败状态', () => {
    expect(isUnauthorized({ code: 401 })).toBeTruthy();
    expect(isUnauthorized({ code: 0 })).toBeFalsy();
    expect(isUnauthorized({ code: 1 })).toBeFalsy();
    expect(isUnauthorized({})).toBeFalsy();
  });

  it('应正确判断禁止访问状态', () => {
    expect(isForbidden({ code: 403 })).toBeTruthy();
    expect(isForbidden({ code: 0 })).toBeFalsy();
    expect(isForbidden({ code: 1 })).toBeFalsy();
    expect(isForbidden({})).toBeFalsy();
  });

  it('应正确判断网络错误状态', () => {
    expect(isNetworkError({ code: 600 })).toBeTruthy();
    expect(isNetworkError({ code: 0 })).toBeFalsy();
    expect(isNetworkError({ code: 1 })).toBeFalsy();
    expect(isNetworkError({})).toBeFalsy();
  });

  it('应根据 HTTP 状态码返回正确的业务状态码', () => {
    expect(getCodeByStatus(1)).toBe(1);
    expect(getCodeByStatus(200)).toBe(0);
    expect(getCodeByStatus(201)).toBe(0);
    expect(getCodeByStatus(299)).toBe(0);
    expect(getCodeByStatus(300)).toBe(300);
    expect(getCodeByStatus(401)).toBe(401);
    expect(getCodeByStatus(403)).toBe(403);
    expect(getCodeByStatus(600)).toBe(600);
  });
});

describe('API 错误处理', () => {
  it('应正确判断错误请求状态', () => {
    expect(isBadRequest({ code: 400 })).toBeTruthy();
    expect(isBadRequest({ code: 0 })).toBeFalsy();
    expect(isBadRequest({ code: 1 })).toBeFalsy();
    expect(isBadRequest({})).toBeFalsy();
  });

  it('应正确判断 try catch 错误状态', () => {
    expect(isTryCatchError({ code: 999 })).toBeTruthy();
    expect(isTryCatchError({ code: 0 })).toBeFalsy();
    expect(isTryCatchError({ code: 1 })).toBeFalsy();
    expect(isTryCatchError({})).toBeFalsy();
  });

  it('应正确处理 try catch 错误响应', () => {
    // 测试 Error 对象
    const error = new Error('测试错误');
    const response = getTryCatchErrorResponse(error);
    expect(response.code).toBe(999);
    expect(response.msg).toBe('测试错误');
    expect(response.error).toBe(error);

    // 测试带 data 属性的错误对象
    const errorWithData = new Error('带数据的错误');
    interface ErrorWithData extends Error {
      data: { test: string };
    }
    (errorWithData as ErrorWithData).data = { test: 'data' };
    const responseWithData = getTryCatchErrorResponse(errorWithData);
    expect(responseWithData.code).toBe(999);
    expect(responseWithData.msg).toBe('带数据的错误');
    expect(responseWithData.error).toBe(errorWithData);
    expect(responseWithData.data).toEqual({ test: 'data' });

    // 测试非 Error 对象
    const nonError = '非错误对象';
    const responseNonError = getTryCatchErrorResponse(nonError);
    expect(responseNonError.code).toBe(999);
    expect(responseNonError.msg).toBe('try catch error');
    expect(responseNonError.error).toBe(nonError);

    // 测试 undefined
    const responseUndefined = getTryCatchErrorResponse(undefined);
    expect(responseUndefined.code).toBe(999);
    expect(responseUndefined.msg).toBe('try catch error');
    expect(responseUndefined.error).toBeUndefined();
  });
});

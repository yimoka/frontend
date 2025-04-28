import { describe, it, expect } from 'vitest';

import { isSuccess, isUnauthorized, isForbidden, isNetworkError, getCodeByStatus } from '../api';

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

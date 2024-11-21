import { describe, it, expect } from 'vitest';

import { isSuccess, isUnauthorized, isForbidden, isNetworkError, getCodeByStatus } from './api';

describe('api', () => {
  it('isSuccess', () => {
    expect(isSuccess({ code: 0 })).toBeTruthy();
    expect(isSuccess({ code: 1 })).toBeFalsy();
    expect(isSuccess({})).toBeFalsy();
  });

  it('isBadRequest', () => {
    expect(isUnauthorized({ code: 401 })).toBeTruthy();
    expect(isUnauthorized({ code: 402 })).toBeFalsy();
    expect(isUnauthorized({})).toBeFalsy();
  });

  it('isUnauthorized', () => {
    expect(isUnauthorized({ code: 401 })).toBeTruthy();
    expect(isUnauthorized({ code: 0 })).toBeFalsy();
    expect(isUnauthorized({ code: 1 })).toBeFalsy();
    expect(isUnauthorized({})).toBeFalsy();
  });

  it('isForbidden', () => {
    expect(isForbidden({ code: 403 })).toBeTruthy();
    expect(isForbidden({ code: 0 })).toBeFalsy();
    expect(isForbidden({ code: 1 })).toBeFalsy();
    expect(isForbidden({})).toBeFalsy();
  });

  it('isNetworkError', () => {
    expect(isNetworkError({ code: 600 })).toBeTruthy();
    expect(isNetworkError({ code: 0 })).toBeFalsy();
    expect(isNetworkError({ code: 1 })).toBeFalsy();
    expect(isNetworkError({})).toBeFalsy();
  });

  it('getCodeByStatus', () => {
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

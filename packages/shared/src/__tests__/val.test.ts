import { describe, it, expect } from 'vitest';

import { isBlank } from '../val';

describe('isBlank', () => {
  it('should return true for null', () => {
    expect(isBlank(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isBlank(undefined)).toBe(true);
  });

  it('should return true for empty string', () => {
    expect(isBlank('')).toBe(true);
  });

  it('should return false for non-empty string', () => {
    expect(isBlank('hello')).toBe(false);
  });

  it('should return false for number 0', () => {
    expect(isBlank(0)).toBe(false);
  });

  it('should return false for boolean false', () => {
    expect(isBlank(false)).toBe(false);
  });

  it('should return true for empty object', () => {
    expect(isBlank({})).toBe(true);
  });

  it('should return true for empty array', () => {
    expect(isBlank([])).toBe(true);
  });

  it('should return false for non-empty object', () => {
    expect(isBlank({ key: 'value' })).toBe(false);
  });

  it('should return false for non-empty array', () => {
    expect(isBlank([1, 2, 3])).toBe(false);
  });
});

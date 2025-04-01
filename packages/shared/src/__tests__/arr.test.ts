import { describe, it, expect } from 'vitest';

import { normalizeToArray } from '../arr';

describe('normalizeToArray', () => {
  it('should return the same array if the input is already an array', () => {
    const input = [1, 2, 3];
    const result = normalizeToArray(input);
    expect(result).toBe(input);
  });

  it('should return an empty array if the input is null', () => {
    const result = normalizeToArray(null);
    expect(result).toEqual([]);
  });

  it('should return an empty array if the input is undefined', () => {
    const result = normalizeToArray(undefined);
    expect(result).toEqual([]);
  });

  it('should return an empty array if the input is an empty string', () => {
    const result = normalizeToArray('');
    expect(result).toEqual([]);
  });

  it('should return an array containing the input value if the input is not an array and not blank', () => {
    const input = 42;
    const result = normalizeToArray(input);
    expect(result).toEqual([input]);
  });

  it('should return an array containing the input value if the input is a non-empty string', () => {
    const input = 'hello';
    const result = normalizeToArray(input);
    expect(result).toEqual([input]);
  });
});

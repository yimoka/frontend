/* eslint-disable @typescript-eslint/ban-ts-comment */

import { describe, it, expect } from 'vitest';

import { addWithLimit, toNumber } from '../num';

describe('num', () => {
  it('toNumber', () => {
    expect(toNumber(1)).toBe(1);
    expect(toNumber('1')).toBe(1);
    expect(toNumber('1.1')).toBe(1.1);
    expect(toNumber('1.1.1')).toBeNaN();
    expect(toNumber('1.1.1', { pattern: '.[^.]+.[^.]' })).toBe(1);
    // @ts-expect-error
    expect(toNumber([])).toBe(0);
    // @ts-expect-error
    expect(toNumber({}, { defaults: 1 })).toBe(1);
    expect(toNumber('1123', { pattern: '1', flags: '' })).toBe(123);
    expect(toNumber('1123', { pattern: '1' })).toBe(23);
  });

  it('addWithLimit', () => {
    expect(addWithLimit(5, { step: 2 })).toBe(7);
    expect(addWithLimit(999, { step: 2 })).toBe(1000);
    expect(addWithLimit(1000, { step: 2 })).toBe(0);
    expect(addWithLimit(0, { step: 2 })).toBe(2);
    expect(addWithLimit(-1, { step: 2 })).toBe(1);
    expect(addWithLimit(5, { step: 2, max: 6 })).toBe(6);
    expect(addWithLimit(5, { step: 2, min: 6 })).toBe(7);
    expect(addWithLimit(5, { step: 2, initial: 10 })).toBe(7);
    expect(addWithLimit(1000, { step: 2, initial: 10 })).toBe(10);
  });
});


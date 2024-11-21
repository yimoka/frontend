import { describe, expect, it, vitest } from 'vitest';

import { promiseSingleton } from './promise';

describe('promiseSingleton', () => {
  it('should return the same promise instance for the same name', async () => {
    const promise = vitest.fn(() => Promise.resolve('foo'));
    const name = 'test';
    const promise1 = promiseSingleton(promise, name);
    const promise2 = promiseSingleton(promise, name);
    expect(promise).toHaveBeenCalledTimes(1);
    expect(await promise1).toBe('foo');
    expect(await promise2).toBe('foo');
    expect(promise).toHaveBeenCalledTimes(1);
  });

  it('should reject the promise if the underlying promise rejects', async () => {
    const promise = vitest.fn(() => Promise.reject(new Error('bar')));
    const name = 'test';
    const promise1 = promiseSingleton(promise, name);
    const promise2 = promiseSingleton(promise, name);
    await expect(promise1).rejects.toThrow('bar');
    await expect(promise2).rejects.toThrow('bar');
    expect(promise).toHaveBeenCalledTimes(1);
  });

  it('should support custom promise maps', async () => {
    const promise = vitest.fn(() => Promise.resolve('baz'));
    const name = 'test';
    const map = { [name]: Promise.resolve('qux') };
    const promise1 = promiseSingleton(promise, name, map);
    const promise2 = promiseSingleton(promise, name, map);
    expect(await promise1).toBe('qux');
    expect(await promise2).toBe('qux');
    expect(promise).not.toHaveBeenCalled();
    const promise3 = promiseSingleton(promise, name, map);
    expect(await promise3).toBe('baz');
    expect(promise).toHaveBeenCalledTimes(1);
    expect(map).not.toHaveProperty(name);
  });
});

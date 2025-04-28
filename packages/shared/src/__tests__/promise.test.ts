import { describe, expect, it, vitest } from 'vitest';

import { promiseSingleton } from '../promise';

describe('Promise 单例模式', () => {
  it('对于相同的名称应返回相同的 Promise 实例', async () => {
    const promise = vitest.fn(() => Promise.resolve('foo'));
    const name = 'test';
    const promise1 = promiseSingleton(promise, name);
    const promise2 = promiseSingleton(promise, name);
    expect(promise).toHaveBeenCalledTimes(1);
    expect(await promise1).toBe('foo');
    expect(await promise2).toBe('foo');
    expect(promise).toHaveBeenCalledTimes(1);
  });

  it('当底层 Promise 被拒绝时应正确传递错误', async () => {
    const promise = vitest.fn(() => Promise.reject(new Error('bar')));
    const name = 'test';
    const promise1 = promiseSingleton(promise, name);
    const promise2 = promiseSingleton(promise, name);
    await expect(promise1).rejects.toThrow('bar');
    await expect(promise2).rejects.toThrow('bar');
    expect(promise).toHaveBeenCalledTimes(1);
  });

  it('应支持自定义 Promise 映射', async () => {
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

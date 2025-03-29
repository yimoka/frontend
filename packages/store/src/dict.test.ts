import { IAny } from '@yimoka/shared';
import { describe, vi, it, expect } from 'vitest';

import { BaseStore } from './base';
import { initStoreDict } from './dict';

describe('initStoreDict', () => {
  it('should set dictionary data directly if data is provided', async () => {
    const apiExecutor = vi.fn((params?: IAny) => Promise.resolve({ code: params?.code ?? 0, msg: '', data: params?.data }));
    const store = new BaseStore({ apiExecutor });
    store.dictConfig = [
      { field: 'a', data: [{ value: '1', label: 'a1' }] },
      { field: 'b', api: { url: '', data: [{ value: '2', label: 'a2' }] } },
      { field: 'c', data: [{ value: '1', label: 'a1' }], api: () => Promise.resolve({ code: 0, data: [{ value: '2', label: 'a2' }] }) },
      { field: 'd', data: [{ value: '1', label: 'a1' }], api: () => Promise.resolve({ code: 1, data: [{ value: '2', label: 'a2' }] }) },
      // toMap
      { field: 'e', api: { url: '', data: [{ value: '2', label: 'a2' }] }, toMap: true },
      // keys
      { field: 'f', api: { url: '', data: [{ id: '2', name: 'a2' }] }, keys: { value: 'id', label: 'name' } },
    ];
    initStoreDict(store);
    expect(store.dict.a).toEqual([{ value: '1', label: 'a1' }]);
    expect(store.dict.b).toBeUndefined();
    expect(store.dict.c).toEqual([{ value: '1', label: 'a1' }]);
    expect(store.dict.d).toEqual([{ value: '1', label: 'a1' }]);

    await vi.waitFor(() => {
      expect(store.dict.b).toEqual([{ value: '2', label: 'a2' }]);
      expect(store.dict.c).toEqual([{ value: '2', label: 'a2' }]);
      // 接口错误不更新数据
      expect(store.dict.d).toEqual([{ value: '1', label: 'a1' }]);
      // toMap
      expect(store.dict.e).toEqual({ 2: 'a2' });
      // keys
      expect(store.dict.f).toEqual([{ value: '2', label: 'a2' }]);
    });
  });
});

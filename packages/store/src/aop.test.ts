import { IHTTPResponse } from '@yimoka/shared';
import { describe, it, expect, beforeEach } from 'vitest';

import { handleAfterAtFetch } from './aop';
import { BaseStore } from './base';

describe('handleAfterAtFetch', () => {
  let store: BaseStore;
  beforeEach(() => {
    store = new BaseStore({ defaultValues: { age: 0 } });
    store.form.createField({ name: 'name', required: true, value: '' });
    store.dictConfig = [];
  });

  it('重置值的时候会清理表单错误', async () => {
    store.form.submit().catch(async (errs) => {
      store.form.setState({ errors: errs });
      expect(store.form.errors.length).toBe(1);
      const res = { data: { name: 'test' } } as IHTTPResponse;
      store.afterAtFetch.resetValues = true;
      handleAfterAtFetch(res, store);
      expect(store.form.errors.length).toBe(0);
    });
  });
});

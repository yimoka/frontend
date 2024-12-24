import { describe, it, expect, beforeEach, vi } from 'vitest';

import { IStoreResponse } from './api';
import { ListStore } from './list';

describe('ListStore', () => {
  let listStore: ListStore;

  beforeEach(() => {
    listStore = new ListStore();
  });

  it('should initialize with default values', () => {
    expect(listStore.selectedRowKeys).toEqual([]);
    expect(listStore.nextLoading).toBe(false);
    expect(listStore.nextResponse).toEqual({});
  });

  it('should set selected row keys', () => {
    const keys = ['row1', 'row2'];
    listStore.setSelectedRowKeys(keys);
    expect(listStore.selectedRowKeys).toEqual(keys);
  });

  it('should set next loading state', () => {
    listStore.setNextLoading(true);
    expect(listStore.nextLoading).toBe(true);
  });

  it('should set next response', () => {
    const response: IStoreResponse = { data: [{ id: 1 }] };
    listStore.setNextResponse(response);
    expect(listStore.nextResponse).toEqual(response);
  });

  it('should get list data from response', () => {
    listStore.setResponse({ data: [{ id: 1 }, { id: 2 }] });
    expect(listStore.listData).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('should get pagination info from response', () => {
    listStore.setResponse({ data: { data: [{ id: 1 }, { id: 2 }], total: 2 } });
    expect(listStore.pagination).toEqual({ page: 1, pageSize: 10, total: 2 });

    listStore.setResponse({ data: { data: [{ id: 1 }, { id: 2 }], total: 2, page: 2, pageSize: 5 } });
    expect(listStore.pagination).toEqual({ page: 2, pageSize: 5, total: 2 });
  });

  it('should determine if there is a next page', () => {
    listStore.setResponse({ data: { data: [{ id: 1 }, { id: 2 }], total: 2 } });
    expect(listStore.isHasNext).toBe(false);
  });

  it('should load next data', () => {
    listStore.setResponse({ data: [{ id: 1 }] });
    listStore.loadNextData([{ id: 2 }]);
    expect(listStore.listData).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('should fetch next page data', async () => {
    const apiMock = vi.fn().mockResolvedValue({ code: 0, data: { data: [{ id: 3 }], total: 3 } });
    listStore.api = apiMock;
    listStore.setResponse({ code: 0, data: { data: [{ id: 1 }, { id: 2 }], total: 2 } });

    const response = await listStore.fetchNext();
    expect(response).toBeNull();

    listStore.setResponse({ code: 0, data: { data: [{ id: 1 }, { id: 2 }], total: 11 } });

    const response2 = await listStore.fetchNext();
    expect(response2).toEqual({ code: 0, data: { data: [{ id: 3 }], total: 3 } });

    expect(listStore.listData).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });
});

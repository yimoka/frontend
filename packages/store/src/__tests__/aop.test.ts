/**
 * @file aop.test.ts
 * @remarks AOP 模块单元测试
 * @author ickeep <i@ickeep.com>
 * @module @yimoka/store
 */

import { describe, it, expect, vi } from 'vitest';

import { handleAfterAtFetch } from '../aop';
import { BaseStore } from '../base';

describe('AOP 模块', () => {
  describe('handleAfterAtFetch', () => {
    it('应该正确处理成功响应', () => {
      const mockStore = {
        afterAtFetch: {},
        resetValues: vi.fn(),
        form: {
          clearErrors: vi.fn(),
        },
        notifier: vi.fn(),
      } as unknown as BaseStore;

      const res = { code: 0, msg: '操作成功' };
      handleAfterAtFetch(res, mockStore);
      expect(mockStore.resetValues).not.toHaveBeenCalled();
      expect(mockStore.form.clearErrors).not.toHaveBeenCalled();
      expect(mockStore.notifier).not.toHaveBeenCalled();
    });

    it('应该在成功时重置值', () => {
      const mockStore = {
        afterAtFetch: {
          resetValues: 'success',
        },
        resetValues: vi.fn(),
        form: {
          clearErrors: vi.fn(),
        },
        notifier: vi.fn(),
      } as unknown as BaseStore;

      const res = { code: 0, msg: '操作成功' };
      handleAfterAtFetch(res, mockStore);
      expect(mockStore.resetValues).toHaveBeenCalled();
      expect(mockStore.form.clearErrors).toHaveBeenCalled();
    });

    it('应该执行成功回调', () => {
      const successRun = vi.fn();
      const mockStore = {
        afterAtFetch: {
          successRun,
        },
        resetValues: vi.fn(),
        form: {
          clearErrors: vi.fn(),
        },
        notifier: vi.fn(),
      } as unknown as BaseStore;

      const res = { code: 0, msg: '操作成功' };
      handleAfterAtFetch(res, mockStore);
      expect(successRun).toHaveBeenCalledWith(res, mockStore);
    });

    it('应该执行失败回调', () => {
      const failRun = vi.fn();
      const mockStore = {
        afterAtFetch: {
          failRun,
        },
        resetValues: vi.fn(),
        form: {
          clearErrors: vi.fn(),
        },
        notifier: vi.fn(),
      } as unknown as BaseStore;

      const res = { code: 500, msg: '操作失败', success: false };
      handleAfterAtFetch(res, mockStore);
      expect(failRun).toHaveBeenCalledWith(res, mockStore);
    });

    it('应该执行通用回调', () => {
      const run = vi.fn();
      const mockStore = {
        afterAtFetch: {
          run,
        },
        resetValues: vi.fn(),
        form: {
          clearErrors: vi.fn(),
        },
        notifier: vi.fn(),
      } as unknown as BaseStore;

      const res = { code: 0, msg: '操作成功' };
      handleAfterAtFetch(res, mockStore);
      expect(run).toHaveBeenCalledWith(res, mockStore);
    });

    it('应该在成功时显示通知', () => {
      const mockStore = {
        afterAtFetch: {
          notify: true,
        },
        resetValues: vi.fn(),
        form: {
          clearErrors: vi.fn(),
        },
        notifier: vi.fn(),
      } as unknown as BaseStore;

      const res = { code: 0, msg: '操作成功' };
      handleAfterAtFetch(res, mockStore);
      expect(mockStore.notifier).toHaveBeenCalledWith('success', '操作成功');
    });

    it('应该在失败时显示通知', () => {
      const mockStore = {
        afterAtFetch: {
          notify: true,
        },
        resetValues: vi.fn(),
        form: {
          clearErrors: vi.fn(),
        },
        notifier: vi.fn(),
      } as unknown as BaseStore;

      const res = { code: 500, msg: '操作失败', success: false };
      handleAfterAtFetch(res, mockStore);
      expect(mockStore.notifier).toHaveBeenCalledWith('error', '操作失败');
    });

    it('应该使用自定义成功通知消息', () => {
      const mockStore = {
        afterAtFetch: {
          successNotify: '保存成功',
        },
        resetValues: vi.fn(),
        form: {
          clearErrors: vi.fn(),
        },
        notifier: vi.fn(),
      } as unknown as BaseStore;

      const res = { code: 0, msg: '操作成功' };
      handleAfterAtFetch(res, mockStore);
      expect(mockStore.notifier).toHaveBeenCalledWith('success', '保存成功');
    });

    it('应该使用自定义失败通知消息', () => {
      const mockStore = {
        afterAtFetch: {
          failNotify: '保存失败',
        },
        resetValues: vi.fn(),
        form: {
          clearErrors: vi.fn(),
        },
        notifier: vi.fn(),
      } as unknown as BaseStore;

      const res = { code: 500, msg: '操作失败', success: false };
      handleAfterAtFetch(res, mockStore);
      expect(mockStore.notifier).toHaveBeenCalledWith('error', '保存失败');
    });

    it('应该在消息为空时使用默认消息', () => {
      const mockStore = {
        afterAtFetch: {
          notify: true,
        },
        resetValues: vi.fn(),
        form: {
          clearErrors: vi.fn(),
        },
        notifier: vi.fn(),
      } as unknown as BaseStore;

      const res = { code: 0, msg: '' };
      handleAfterAtFetch(res, mockStore);
      expect(mockStore.notifier).toHaveBeenCalledWith('success', '成功了');
    });
  });
});

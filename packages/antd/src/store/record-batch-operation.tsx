/**
 * @file record-batch-operation.tsx
 * 记录批量操作组件，用于处理数据记录的批量操作，支持确认弹窗和触发操作
 * @module @yimoka/antd
 * @author Yimoka Team
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * // 基础用法
 * <RecordBatchOperation
 *   idsKey="ids"
 *   operation="del"
 *   store={store}
 *   trigger={{ text: '删除' }}
 *   popconfirm={{ title: '确认删除该记录？' }}
 * />
 *
 * // 带默认值的批量操作
 * <RecordBatchOperation
 *   idsKey="ids"
 *   operation="update"
 *   store={store}
 *   defaultValues={{ status: 'active' }}
 *   trigger={{ text: '更新状态' }}
 * />
 * ```
 */

import { observer, useExpressionScope } from '@formily/react';
import { Trigger, useAPIExecutor, useNotifier, useStore } from '@yimoka/react';
import { isSuccess } from '@yimoka/shared';
import { BaseStore, getEntityStore, ListStore } from '@yimoka/store';
import { Button, Popconfirm } from 'antd';
import { pick } from 'lodash-es';
import React, { useMemo, useState } from 'react';

import { RecordOperationProps } from './record-operation';

/** 默认的确认弹窗标题 */
const DEFAULT_POPCONFIRM_TITLE = '确认';
/** 默认的ID字段名 */
const DEFAULT_ID_KEYS = 'ids';

/**
 * RecordBatchOperation 组件
 * 用于处理记录相关的批量操作，支持确认弹窗和触发操作
 * @component
 * @param {RecordBatchOperationProps} props - 组件属性
 * @returns {JSX.Element} 返回操作按钮组件
 *
 * @example
 * ```tsx
 * // 带自定义配置的操作
 * <RecordBatchOperation
 *   operation="custom"
 *   store={store}
 *   config={{ idKey: 'customId' }}
 *   trigger={{ text: '自定义操作' }}
 * />
 * ```
 */
export const RecordBatchOperation = observer((props: RecordBatchOperationProps) => {
  const { idsKey, parentStore, store, popconfirm, trigger, operation, config, defaultValues, record, isRefresh = true } = props;
  const { $config, $record, $index } = useExpressionScope() ?? {};
  const pStore = useStore(parentStore) as ListStore;
  const [loading, setLoading] = useState(false);
  const apiExecutor = useAPIExecutor();
  const notifier = useNotifier();
  const { selectedRowKeys } = pStore ?? {};

  /**
   * 执行批量操作的核心函数
   * 初始化 store 并执行批量操作，支持批量操作成功后刷新父级数据
   * @async
   * @returns {Promise<void>}
   */
  const run = async () => {
    // 初始化store实例
    const initStore = () => {
      const runStoreOrConfig = getEntityStore(store, operation, config ?? $config, true);
      return runStoreOrConfig instanceof BaseStore ? runStoreOrConfig : new BaseStore(runStoreOrConfig);
    };

    const runStore = initStore();
    !runStore.apiExecutor && (runStore.apiExecutor = apiExecutor);
    !runStore.notifier && (runStore.notifier = notifier);
    const curIDKeys = idsKey ?? (config ?? $config)?.idKeys ?? DEFAULT_ID_KEYS;
    // 合并默认值
    runStore.defaultValues = { ...runStore.defaultValues, ...defaultValues };
    // 设置操作值
    const newValues = pick({ $index, ...$record, ...record }, Object.keys(runStore.defaultValues));
    newValues[curIDKeys] = selectedRowKeys;
    runStore.setValues(newValues);
    setLoading(true);
    const res = await runStore.fetch();
    (isSuccess(res) && isRefresh) && await pStore?.fetch();
    setLoading(false);
  };

  /**
   * 优化 popconfirm 配置
   * 处理 popconfirm 属性，支持布尔值和对象两种配置方式
   * @returns {PopconfirmProps | null} 处理后的 popconfirm 配置
   */
  const popconfirmProps = useMemo(() => {
    if (!popconfirm) return null;
    return popconfirm === true ? { title: DEFAULT_POPCONFIRM_TITLE } : popconfirm;
  }, [popconfirm]);

  if (popconfirmProps) {
    return (
      <Popconfirm
        {...popconfirmProps}
        okButtonProps={{ loading, ...popconfirmProps.okButtonProps }}
        onConfirm={(e) => {
          popconfirmProps.onConfirm?.(e);
          run();
        }}>
        {/* fix Warning: findDOMNode is deprecated and will be removed in the next major release. Instead, */}
        <>
          <Trigger
            component={Button}
            disabled={!selectedRowKeys?.length}
            loading={loading}
            {...trigger}
          />
        </>
      </Popconfirm>
    );
  }

  return (
    <Trigger
      component={Button}
      disabled={!selectedRowKeys?.length}
      loading={loading}
      {...trigger}
      onTrig={(...args) => {
        run();
        trigger?.onTrig?.(...args);
      }}
    />
  );
});

/**
 * RecordBatchOperation 组件属性接口
 * @interface RecordBatchOperationProps
 * @extends {Pick<Partial<IEntityOpProps>, 'store' | 'operation' | 'config' | 'operation'>}
 */
export interface RecordBatchOperationProps extends RecordOperationProps {
  idsKey?: string
}

/**
 * @file record-operation.tsx
 * 记录操作组件，用于处理数据记录的相关操作，支持确认弹窗和触发操作
 * @module @yimoka/antd
 * @author Yimoka Team
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * // 基础用法
 * <RecordOperation
 *   operation="delete"
 *   store={store}
 *   trigger={{ text: '删除' }}
 *   popconfirm={{ title: '确认删除该记录？' }}
 * />
 *
 * // 带默认值的操作
 * <RecordOperation
 *   operation="update"
 *   store={store}
 *   defaultValues={{ status: 'active' }}
 *   trigger={{ text: '更新状态' }}
 * />
 * ```
 */

import { useExpressionScope, observer } from '@formily/react';
import { IEntityOpProps, Trigger, TriggerProps, useAPIExecutor, useNotifier, useStore } from '@yimoka/react';
import { IAnyObject, isSuccess } from '@yimoka/shared';
import { BaseStore, getEntityStore, IAPIKey, IStore } from '@yimoka/store';
import { Button, Popconfirm, PopconfirmProps } from 'antd';
import { pick } from 'lodash-es';
import React, { useMemo, useState } from 'react';

/** 默认的确认弹窗标题 */
const DEFAULT_POPCONFIRM_TITLE = '确认';
/** 默认的ID字段名 */
const DEFAULT_ID_KEY = 'id';

/**
 * RecordOperation 组件
 * 用于处理记录相关的操作，支持确认弹窗和触发操作
 * @component
 * @param {RecordOperationProps} props - 组件属性
 * @returns {JSX.Element} 返回操作按钮组件
 *
 * @example
 * ```tsx
 * // 带自定义配置的操作
 * <RecordOperation
 *   operation="custom"
 *   store={store}
 *   config={{ idKey: 'customId' }}
 *   trigger={{ text: '自定义操作' }}
 * />
 * ```
 */
export const RecordOperation = observer((props: RecordOperationProps) => {
  const { parentStore, store, popconfirm, trigger, operation, config, defaultValues, record, isRefresh } = props;
  const { $config, $record, $index } = useExpressionScope() ?? {};
  const pStore = useStore(parentStore);
  const [loading, setLoading] = useState(false);
  const apiExecutor = useAPIExecutor();
  const notifier = useNotifier();

  /**
   * 执行操作的核心函数
   * 初始化store并执行操作，支持操作成功后刷新父级数据
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
    // 合并默认值
    runStore.defaultValues = { ...runStore.defaultValues, ...defaultValues };
    const idKey = (config ?? $config)?.idKey ?? DEFAULT_ID_KEY;
    // 设置操作值
    const newValues = pick({ $index, ...$record, ...record }, idKey, Object.keys(runStore.defaultValues));
    runStore.setValues(newValues);
    setLoading(true);
    console.log('runStore', runStore);
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
          <Trigger component={Button} {...trigger} />
        </>
      </Popconfirm>
    );
  }

  return (
    <Trigger
      component="Button"
      {...trigger}
      onTrig={(...args) => {
        run();
        trigger?.onTrig?.(...args);
      }}
    />
  );
});

/**
 * RecordOperation 组件属性接口
 * @interface RecordOperationProps
 * @extends {Pick<Partial<IEntityOpProps>, 'store' | 'operation' | 'config' | 'operation'>}
 */
export interface RecordOperationProps extends Pick<Partial<IEntityOpProps>, 'store' | 'operation' | 'config' | 'operation'> {
  /** 操作类型，必填 */
  operation: IAPIKey
  /** 父级 store，用于刷新数据，可选 */
  parentStore?: IStore;
  /** 是否在操作成功后刷新父级数据，可选 */
  isRefresh?: boolean;
  /** 默认值，可选 */
  defaultValues?: IAnyObject;
  /** 记录数据，可选 */
  record?: IAnyObject;
  /** 确认弹窗配置，可选 */
  popconfirm?: PopconfirmProps | true;
  /** 触发按钮配置，可选 */
  trigger?: TriggerProps;
}

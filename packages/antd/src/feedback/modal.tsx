import { observer, Trigger, TriggerProps, useAdditionalNode, useStore, WatchChildStore } from '@yimoka/react';
import { isSuccess } from '@yimoka/shared';
import { IStore } from '@yimoka/store';
import { Modal as AntModal, ModalProps as AntModalProps } from 'antd';
import React, { useState, useEffect, ReactNode, useMemo, useCallback } from 'react';

import { Button } from '../base/button';
import { strToIcon } from '../tools/icon';

/**
 * Modal 组件的属性类型定义
 * 扩展自 antd 的 ModalProps，增加了触发器、子 store 绑定等功能
 */
export type ModalProps = AntModalProps & {
  /** 触发器配置，设置为 false 则不显示触发器 */
  trigger?: TriggerProps | false
  /** 触发器显示的文本，默认使用 title */
  triggerText?: ReactNode
  /** 触发器点击时的回调函数 */
  onOpen?: TriggerProps['onTrig']
  /** 确定按钮点击后是否关闭弹窗
   * true: 总是关闭
   * 'success': 成功时关闭
   * 'fail': 失败时关闭
   */
  closeOnOk?: boolean | 'success' | 'fail'
  /** 是否绑定子 store */
  bindChildStore?: boolean
  /** 子 store 的回调函数 */
  onChildStore?: (store: IStore) => void
  /** 执行成功时 是否执行 store 的 fetch */
  fetchOnSuccess?: boolean
  store?: IStore
}

/**
 * Modal 组件
 * 基于 antd Modal 的封装，增加了触发器、子 store 绑定等功能
 */
export const Modal = observer((props: ModalProps) => {
  const {
    trigger,
    triggerText,
    onOpen,
    open: oldOpen,
    title,
    onClose,
    onCancel,
    onOk,
    okButtonProps,
    closeOnOk = 'success',
    closeIcon,
    cancelText,
    okText,
    footer,
    bindChildStore,
    onChildStore,
    children,
    store,
    fetchOnSuccess,
    ...rest
  } = props;

  // 内部状态管理
  const [open, setOpen] = useState(oldOpen);
  const [childStore, setChildStore] = useState<IStore>();
  const curStore = useStore(store);

  // 使用 useAdditionalNode 处理可自定义的节点
  const cancelTextNode = useAdditionalNode('cancelText', cancelText);
  const okTextNode = useAdditionalNode('okText', okText);
  const footerNode = useAdditionalNode('footer', footer);
  const titleNode = useAdditionalNode('title', title);

  // 同步外部 open 状态
  useEffect(() => {
    setOpen(oldOpen);
  }, [oldOpen]);

  // 处理确定按钮的属性
  const okProps = useMemo(() => {
    if (!bindChildStore || !childStore) {
      return okButtonProps;
    }
    const { loading, form } = childStore;
    const disabled = form?.disabled || !!form?.errors?.length;
    return { ...okButtonProps, disabled, loading };
  }, [bindChildStore, childStore, okButtonProps]);

  // 处理确定按钮点击事件
  const handleOk = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onOk?.(e);

    if (!bindChildStore || !childStore) {
      if (closeOnOk === true || closeOnOk === 'success') {
        setOpen(false);
      }
      return;
    }

    const { fetch, form } = childStore;
    const run = async () => {
      const res = await fetch();
      if (isSuccess(res) && fetchOnSuccess) {
        curStore?.fetch();
      }
      if (
        closeOnOk === true
        || (closeOnOk === 'success' && isSuccess(res))
        || (closeOnOk === 'fail' && !isSuccess(res))
      ) {
        setOpen(false);
      }
    };

    if (form?.submit) {
      form.submit().then(() => run());
    } else {
      run();
    }
  }, [bindChildStore, childStore, closeOnOk, curStore, fetchOnSuccess, onOk]);

  return (
    <>
      {/* 触发器按钮 */}
      {trigger !== false && (
        <Trigger
          children={triggerText ?? titleNode}
          component={Button}
          {...trigger}
          onTrig={(...args) => {
            setOpen(true);
            trigger?.onTrig?.(...args);
            onOpen?.(...args);
          }}
        />
      )}

      {/* Modal 主体 */}
      <AntModal
        {...rest}
        cancelText={cancelTextNode}
        closeIcon={strToIcon(closeIcon)}
        footer={footerNode}
        okButtonProps={okProps}
        okText={okTextNode}
        open={open}
        title={titleNode}
        onCancel={(e) => {
          setOpen(false);
          onCancel?.(e);
        }}
        onClose={(e) => {
          setOpen(false);
          onClose?.(e);
        }}
        onOk={handleOk}
      >
        {bindChildStore ? (
          <WatchChildStore
            children={children}
            onStore={(store) => {
              setChildStore(store);
              onChildStore?.(store);
            }}
          />
        ) : (
          children
        )}
      </AntModal>
    </>
  );
});

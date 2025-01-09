import { components } from '@yimoka/antd';
import { ConfigProvider, IConfig } from '@yimoka/react';
import { INotifier } from '@yimoka/store';
import { App } from 'antd';
import { get } from 'lodash-es';
import React, { PropsWithChildren, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { httpRequest } from '@/http';

const { useApp } = App;

export const InitConfig = (props: PropsWithChildren) => {
  const { children } = props;
  const [isInit, setIsInit] = useState(false);
  const { notification } = useApp();

  // 适配通知器
  const notifier = useMemo(() => ((type, msg, options) => {
    if (type === 'close') {
      notification.destroy(msg ?? options?.key);
      return;
    }
    const fn = get(notification, type);
    if (typeof fn === 'function') {
      fn({ message: titleMap[type], ...options, description: msg || options?.description });
    };
  }) as INotifier, [notification]);

  const config: IConfig = useMemo(() => {
    setIsInit(true);
    return {
      notifier,
      apiExecutor: httpRequest,
      components,
      useNavigate,
      useLocation,
      useRouteParams: useParams,
    };
  }, [notifier]);

  return <ConfigProvider value={config}>  {isInit ? children : null}</ConfigProvider>;
};

const titleMap: Record<string, string> = {
  success: '成功',
  error: '错误',
  info: '提示',
  warning: '警告',
  warn: '警告',
  confirm: '确认',
  loading: '加载',
};

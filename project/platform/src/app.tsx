import { ConfigProvider, App, theme } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { InitConfig } from '@/config';
import { Pwa } from '@/pwa';
import { RootRouter } from '@/router';

import { HandleAuthErr } from './auth-err';
import { BaseLayout } from './layout/base';

dayjs.locale('zh-cn');

export default function app() {
  return (
    <BrowserRouter>
      <ConfigProvider
        locale={zhCN}
        theme={{ algorithm: [theme.compactAlgorithm], components: { Divider: { margin: 12, marginLG: 12 } } }}
      >
        <App component={false}>
          <Pwa />
          <InitConfig>
            <BaseLayout>
              <RootRouter />
            </BaseLayout>
            <HandleAuthErr />
          </InitConfig>
        </App>
      </ConfigProvider>
    </BrowserRouter>
  );
}


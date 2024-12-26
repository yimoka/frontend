import { ConfigProvider, App, theme } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { BrowserRouter } from 'react-router-dom';

import { InitConfig } from '@/config';
import { Pwa } from '@/pwa';
import { RootRouter } from '@/router';

import { BaseLayout } from './layout/base';

dayjs.locale('zh-cn');

export default function app() {
  return (
    <BrowserRouter>
      <ConfigProvider
        locale={zhCN}
        theme={{ algorithm: [theme.compactAlgorithm] }}
      >
        <App component={false}>
          <Pwa />
          <InitConfig>
            <BaseLayout>
              <RootRouter />
            </BaseLayout>
          </InitConfig>
        </App>
      </ConfigProvider>
    </BrowserRouter>
  );
}


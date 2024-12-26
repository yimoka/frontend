import { ConfigProvider, App } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { BrowserRouter } from 'react-router-dom';

import { InitConfig } from '@/config';
import { Pwa } from '@/pwa';
import { RootRouter } from '@/router';

dayjs.locale('zh-cn');

export default function app() {
  return (
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <App component={false}>
          <Pwa />
          <InitConfig>
            <RootRouter />
          </InitConfig>
        </App>
      </ConfigProvider>
    </BrowserRouter>
  );
}


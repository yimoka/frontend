import { observer } from '@formily/react';
import { ConfigProvider, Layout, theme } from 'antd';
import React from 'react';
const { useToken } = theme;

export const Header = observer(() => {
  const { token } = useToken();

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: { itemBg: token.colorBgContainer },
          Layout: { headerBg: token.colorBgContainer },
        },
      }}
    >
      <Layout.Header style={{ zIndex: 9, boxShadow: `0 1px 6px ${token.colorBorder}` }} title='标题' ></Layout.Header>
    </ConfigProvider>
  );
});

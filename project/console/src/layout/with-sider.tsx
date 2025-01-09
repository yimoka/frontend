import { observer } from '@formily/react';
import { Flex, Layout, LayoutProps, MenuProps, SiderProps, theme } from 'antd';
import React from 'react';

import { Sider } from './components/sider';

const { useToken } = theme;
export const WithSiderLayout = observer((props: LayoutProps & { menus?: MenuProps['items'], sider?: SiderProps }) => {
  const { children, style, menus, sider, ...rest } = props;
  const { token } = useToken();
  return (
    <Layout hasSider {...rest} style={{ ...style }} >
      <Sider defaultCollapsed {...sider} menus={menus} />
      <Layout.Content style={{ display: 'flex', flexDirection: 'column', padding: token.paddingContentHorizontal, height: '100%', overflowY: 'auto' }} >
        <Flex vertical style={{ padding: token.paddingContentHorizontal, background: token.colorBgContainer, flex: 1 }} >
          {children}
        </Flex>
      </Layout.Content>
    </Layout >
  );
});

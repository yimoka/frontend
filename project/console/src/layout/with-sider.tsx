import { observer } from '@formily/react';
import { Flex, Layout, LayoutProps, MenuProps, SiderProps } from 'antd';

import { Sider } from './components/sider';

export const WithSiderLayout = observer((props: LayoutProps & { menus?: MenuProps['items'], sider?: SiderProps }) => {
  const { children, style, menus, sider, ...rest } = props;

  return (
    <Layout hasSider {...rest} style={{ ...style }} >
      <Sider defaultCollapsed {...sider} menus={menus} />
      <Layout.Content style={{ display: 'flex', flexDirection: 'column', padding: 16, height: '100%', overflowY: 'auto' }} >
        <Flex vertical style={{ padding: 16, background: '#fff', flex: 1 }} >
          {children}
        </Flex>
      </Layout.Content>
    </Layout >
  );
});

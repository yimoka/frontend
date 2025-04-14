import { Flex, Layout, LayoutProps, theme } from '@yimoka/antd';
import { observer } from '@yimoka/react';
import React, { CSSProperties } from 'react';

import { Footer } from './components/footer';
const { useToken } = theme;

export const WithFooterLayout = observer((props: LayoutProps & { contentStyle?: CSSProperties }) => {
  const { children, style, contentStyle, ...rest } = props;
  const { token } = useToken();

  return (
    <Layout {...rest} style={{ height: '100%', overflowY: 'auto', ...style }}>
      <Flex vertical style={{ flex: 1, background: token.colorBgContainer, ...contentStyle }}>
        {children}
      </Flex>
      <Footer />
    </Layout >
  );
});

import { Layout, LayoutProps } from '@yimoka/antd';
import { observer } from '@yimoka/react';
import React from 'react';

import { Header } from './components/header';

const { Content } = Layout;

export const BaseLayout = observer((props: LayoutProps) => {
  const { children, style, ...rest } = props;
  return (
    <Layout {...rest} >
      <Header />
      <Content style={{ display: 'flex', flexDirection: 'column' }}>
        {children}
      </Content>
    </Layout>
  );
});

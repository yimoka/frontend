import { observer } from '@formily/react';
import { Flex, Layout, LayoutProps } from 'antd';

import { Footer } from './components/footer';

export const WithFooterLayout = observer((props: LayoutProps) => {
  const { children, style, ...rest } = props;
  return (
    <Layout {...rest} style={{ height: '100%', overflowY: 'auto', ...style }}>
      <Flex vertical style={{ flex: 1 }}>
        {children}
      </Flex>
      <Footer />
    </Layout >
  );
});

import { Flex, theme } from 'antd';

import { WithFooterLayout } from '@/layout/with-footer';
const { useToken } = theme;

export const IndexPage = () => {
  const { token } = useToken();

  return <WithFooterLayout>
    <Flex vertical style={{ padding: token.paddingContentHorizontal, background: token.colorBgBase, flex: 1 }} >
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
      <h1>index</h1>
    </Flex>
  </WithFooterLayout >;
};

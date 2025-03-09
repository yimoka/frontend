import { observer } from '@formily/react';
import { Content } from '@yimoka/antd';
import { GetProps, theme } from 'antd';
import React from 'react';

const { useToken } = theme;

export const PageContent = observer((props: GetProps<typeof Content>) => {
  const { style, ...rest } = props;
  const { token } = useToken();
  return <Content {...rest} style={{ padding: token.paddingContentHorizontal, ...style }} />;
});

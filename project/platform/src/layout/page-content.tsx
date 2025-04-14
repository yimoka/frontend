import { observer } from '@yimoka/react';
import { Content, GetProps, theme } from '@yimoka/antd';
import React from 'react';

const { useToken } = theme;

export const PageContent = observer((props: GetProps<typeof Content>) => {
  const { style, ...rest } = props;
  const { token } = useToken();
  return <Content {...rest} style={{ padding: token.paddingContentHorizontal, ...style }} />;
});

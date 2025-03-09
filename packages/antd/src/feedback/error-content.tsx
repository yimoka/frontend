
import { observer } from '@formily/react';
import { ErrorComponent } from '@yimoka/react';
import { isSuccess } from '@yimoka/shared';
import { Result, ResultProps, Button, Spin } from 'antd';

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Paragraph } from '../base/typography';

export const ErrorContent: ErrorComponent = observer((props) => {
  const { returnIndex = true, loading, response, onAgain, icon, status, children, size, trace = 'x-trace-id', ...args } = props;
  const success = isSuccess(response);
  const { msg, code, headers } = response;

  const isErr = useMemo(() => ((!loading || (loading && code))) && !success && code, [loading, success, code]);
  const traceID = useMemo(() => trace && headers?.[trace], [headers, trace]);

  if (!isErr) {
    return null;
  }

  // TODO: 根据不同的 size 显示不同的界面

  const resultProps: ResultProps = {
    ...args,
    icon,
    status,
    title: `出错了 ${code ?? ''}`,
    subTitle: msg,
    extra: <>
      {returnIndex && <Link to='/'><Button >返回首页</Button></Link>}
      {onAgain && <Button type='primary' onClick={onAgain}>再试一次</Button>}
      {traceID && <Paragraph type='secondary' style={{ marginTop: 10 }} italic copyable={{ text: traceID }}>traceID: {traceID}</Paragraph>}
    </>,
    children,
  };

  return (
    <Spin spinning={loading}>
      <Result {...resultProps} />
    </Spin>
  );
});

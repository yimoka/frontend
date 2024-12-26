import { observer } from '@formily/react';
import { isSuccess } from '@yimoka/shared';
import { IStoreResponse } from '@yimoka/store';
import { Result, ResultProps, Button, Spin } from 'antd';
import React, { FC, useMemo } from 'react';
import { Link } from 'react-router-dom';

export interface ErrorContentProps extends Omit<ResultProps, 'icon'> {
  isReturnIndex?: boolean
  loading?: boolean;
  response: IStoreResponse;
  onAgain?: () => unknown | Promise<unknown>;
  icon?: string
  children?: React.ReactNode
}

export const ErrorContent: FC<ErrorContentProps> = observer((props) => {
  const { isReturnIndex = true, loading, response, onAgain, icon, status, children, ...args } = props;
  const success = isSuccess(response);
  const { msg, code } = response;

  const isErr = useMemo(() => ((!loading || (loading && code))) && !success && code, [loading, success, code]);

  if (!isErr) {
    return null;
  }

  const resultProps: ResultProps = {
    ...args,
    icon,
    status,
    title: `出错了 ${code ?? ''}`,
    subTitle: msg,
    extra: <>
      {isReturnIndex && <Link to='/'><Button >返回首页</Button></Link>}
      {onAgain && <Button type='primary' onClick={onAgain}>再试一次</Button>}
    </>,
    children,
  };

  return (
    <Spin spinning={loading}>
      <Result {...resultProps} />
    </Spin>
  );
});

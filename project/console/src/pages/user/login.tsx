import { observer } from '@formily/react';
import { useRoot } from '@yimoka/react';
import { IFetchListener } from '@yimoka/store';
import { Card } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { clearAuthErr } from '@/root';
import { setUserToken } from '@/token';

import { LoginByMail } from './login-mail';

export const LoginPage = observer(() => {
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') ?? '/';
  const nav = useNavigate();

  return (
    <div style={{
      flex: 'auto',
      background: 'url(https://static-1325426858.cos.ap-guangzhou.myqcloud.com/img/bg5.jpg) no-repeat center center',
      backgroundSize: 'cover',
    }}>
      <Card
        style={{
          width: 390,
          position: 'absolute',
          top: 200,
          right: 200,
          boxShadow: 'rgb(0 0 0 / 15%) 0px 3px 15px',
        }}
      >
        <Login onSuccess={() => nav?.(`/user/tenant?redirect=${encodeURIComponent(redirect)}`, { replace: true })} />
      </Card>
    </div >
  );
});

export const Login = ({ onSuccess }: { onSuccess?: IFetchListener }) => {
  const root = useRoot();

  const success: IFetchListener = (res, store) => {
    const { data } = res;
    root.setUser(data?.user);
    if (data.token) {
      setUserToken(data.token);
    };
    clearAuthErr();
    onSuccess?.(res, store);
  };

  return <LoginByMail onSuccess={success} />;
};



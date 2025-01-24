import { observer } from '@formily/react';
import { useRoot } from '@yimoka/react';
import { Card } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { setUserToken } from '@/token';

import { LoginByMail } from './login-mail';

export const LoginPage = observer(() => {
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') ?? '/';
  const root = useRoot();
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
        <LoginByMail onSuccess={(res) => {
          root.setUser(res);
          if (res.token) {
            setUserToken(res.token);
          };
          nav?.(`/user/tenant?redirect=${encodeURIComponent(redirect)}`, { replace: true });
        }} />
      </Card>
    </div >
  );
});



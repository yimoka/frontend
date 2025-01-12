import { observer } from '@formily/react';
import { useRoot } from '@yimoka/react';
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
      background: `url(${img}/bg5.jpg) no-repeat center center`,
      backgroundSize: 'cover',
    }}>
      <AuthBox >
        <LoginByMail onSuccess={(res) => {
          root.setUser(res);
          if (res.token) {
            setUserToken(res.token);
          };
          nav?.(`/user/tenant?redirect=${encodeURIComponent(redirect)}`, { replace: true });
        }} />
      </AuthBox>
    </div>
  );
});



import { observer } from '@formily/react';
import { IFetchListener } from '@yimoka/store';
import { Card } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { clearAuthErr, setStaff } from '@/root';
import { setStaffToken } from '@/token';

import { StaffLoginByName } from './login-name';

export const StaffLoginPage = observer(() => {
  const { search } = useLocation();
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
        <Login onSuccess={() => {
          const redirect = new URLSearchParams(search).get('redirect') ?? '/';
          nav?.(redirect, { replace: true });
        }} />
      </Card>
    </div >
  );
});

export const Login = ({ onSuccess }: { onSuccess?: IFetchListener }) => {
  const success: IFetchListener = (res, store) => {
    const { data } = res;
    setStaff(data?.user);
    if (data.token) {
      setStaffToken(data.token);
    };
    clearAuthErr();
    onSuccess?.(res, store);
  };

  return <StaffLoginByName onSuccess={success} />;
};


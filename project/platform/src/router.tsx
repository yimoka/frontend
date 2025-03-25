import { Spin } from '@yimoka/antd';
import { EntityResponse, observer, useInitStore } from '@yimoka/react';
import { isForbidden, isSuccess, isUnauthorized } from '@yimoka/shared';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { IndexPage } from '@/pages';
import { AutoPage } from '@/pages/auto';

import { Oauth2Router } from './pages/oath2/router';
import { StaffRouter } from './pages/staff/router';
import { setStaff } from './root';
import { setStaffToken } from './token';

// 需要登录的路由
export const NeedLoginRouter = () => (
  <Routes>
    <Route path="/" element={<IndexPage />} />
    <Route path="/oauth2/*" element={<Oauth2Router />} />
    <Route path="*" element={<AutoPage />} />
  </Routes>
);

export const RootRouter = () => (
  <Routes>
    <Route path="/staff/*" element={<StaffRouter />} />
    <Route path="*" element={<GuardRouter />} />
  </Routes>
);

// 路由守卫
export const GuardRouter = observer(() => {
  //  获取用户信息的 store 判断用户是否登录
  const store = useInitStore({
    options: { runNow: true },
    api: { url: '/base/iam/portal/staff/info' },
    afterAtFetch: {
      successRun: (res) => {
        const { data: { staff, token } = {} } = res;
        if (staff) {
          setStaff(staff);
          setStaffToken(token);
        }
      },
    },
  });

  const { response, loading } = store;
  if (isUnauthorized(response)) {
    return <Navigate to={`/staff/login${getRedirect()}`} />;
  }

  if (isForbidden(response) && response?.metadata?.isChangePassword) {
    return <Navigate to={`/staff/password/change${getRedirect()}`} />;
  }

  if (loading || !isSuccess(response)) {
    return (
      <Spin spinning={loading} tip="登录中……" >
        <div style={{ minHeight: 400 }}>
          <EntityResponse store={store} skeleton={false} />
        </div>
      </Spin>
    );
  }

  return <NeedLoginRouter />;
});

const getRedirect = () => {
  const { pathname, search } = window.location;
  const redirect = `${pathname}${search}`;
  return redirect && redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : '';
};

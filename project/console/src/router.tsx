import { Spin } from '@yimoka/antd';
import { EntityResponse, observer, useInitStore } from '@yimoka/react';
import { isSuccess, isUnauthorized } from '@yimoka/shared';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { IndexPage } from '@/pages';
import { AutoPage } from '@/pages/auto';

import { DemoRouter } from './pages/demo/router';
import { Oauth2Router } from './pages/oath2/router';
import { StaffRouter } from './pages/staff/router';
import { UserRouter } from './pages/user/router';
import { setStaff } from './root';
import { setStaffToken } from './token';

// 需要登录的路由
export const NeedLoginRouter = () => (
  <Routes>
    <Route element={<IndexPage />} path="/" />
    <Route element={<Oauth2Router />} path="/oauth2/*" />
    <Route element={<AutoPage />} path="*" />
  </Routes>
);

export const RootRouter = () => (
  <Routes>
    <Route element={<DemoRouter />} path="/demo/*" />
    <Route element={<UserRouter />} path="/user/*" />
    <Route element={<StaffRouter />} path="/staff/*" />
    <Route element={<GuardRouter />} path="*" />
  </Routes>
);

// 路由守卫
export const GuardRouter = observer(() => {
  //  获取用户信息的 store 判断用户是否登录
  const store = useInitStore({
    options: { runNow: true },
    api: { url: '/admin/tenant/bff/staff/info' },
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
    const { pathname, search } = window.location;
    const redirect = encodeURIComponent(`${pathname}${search}`);
    return <Navigate to={`/user/login?redirect=${redirect}`} />;
  }

  if (loading || !isSuccess(response)) {
    return (
      <Spin spinning={loading} tip="登录中……" >
        <div style={{ minHeight: 400 }}>
          <EntityResponse skeleton={false} store={store} />
        </div>
      </Spin>
    );
  }

  return <NeedLoginRouter />;
});



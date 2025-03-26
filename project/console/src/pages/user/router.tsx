import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { WithFooterLayout } from '@/layout/with-footer';

import { UserLoginPage } from './login';
import { UserTenant } from './tenant';

export const UserRouter = () => (
  <WithFooterLayout>
    <Routes>
      <Route element={<UserLoginPage />} path="login" />
      {/* <Route path="password/change" element={<ChangePassword />} /> */}
      <Route element={<UserTenant />} path="tenant" />
      {/* <Route path="tenant/join/*" element={<TenantJoinRouter />} /> */}
    </Routes>
  </WithFooterLayout>
);

// const TenantJoinRouter = () => (
//   <Content>
//     <Routes>
//       <Route path="" element={<JoinListPage />} />
//       <Route path="add" element={<JoinAddPage />} />
//       <Route path="edit" element={<JoinEditPage />} />
//       <Route path="detail" element={<JoinDetailPage />} />
//     </Routes>
//   </Content>
// );

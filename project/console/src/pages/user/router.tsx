import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { WithFooterLayout } from '@/layout/with-footer';

import { LoginPage } from './login';

export const UserRouter = () => (
  <WithFooterLayout>
    <Routes>
      <Route path="login" element={<LoginPage />} />
      {/* <Route path="password/change" element={<ChangePassword />} /> */}
      {/* <Route path="tenant" element={<UserTenant />} /> */}
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

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { PageNavByMenu } from '@/components/page-nav-by-menu';

import { PermissionTreePage } from './permission/tree';

export const SystemAccessRouter = () => (
  <Routes>
    <Route element={<PageNavByMenu />} path="" />
    <Route element={<PermissionTreePage />} path="permission" />
    {/* <Route path="role" element={<PrivateRoleListPage />} />
    <Route path="staff" element={<StaffListPage />} />
    <Route path="staff/detail" element={<StaffDetailPage />} /> */}
  </Routes>
);

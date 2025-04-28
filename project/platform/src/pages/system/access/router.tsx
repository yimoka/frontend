import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { PageNavByMenu } from '@/components/page-nav-by-menu';

import { PermissionTreePage } from './permission/tree';
import { PrivateRoleListPage } from './private-role/list';
import { StaffListPage } from './staff/list';

export const SystemAccessRouter = () => (
  <Routes>
    <Route element={<PageNavByMenu />} path="" />
    <Route element={<PermissionTreePage />} path="permission" />
    <Route element={<StaffListPage />} path="staff" />
    <Route element={<PrivateRoleListPage />} path="role" />
    {/* <Route path="staff/detail" element={<StaffDetailPage />} /> */}
  </Routes>
);

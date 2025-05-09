import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { PageNavByMenu } from '@/components/page-nav-by-menu';

import { PermissionTreePage } from './permission/tree';
import { PrivateRoleListPage } from './private-role/list';
import { StaffDetail } from './staff/detail';
import { StaffListPage } from './staff/list';

export const SystemAccessRouter = () => (
  <Routes>
    <Route element={<PageNavByMenu />} path="" />
    <Route element={<PermissionTreePage />} path="permission" />
    <Route element={<StaffListPage />} path="staff" />
    <Route element={<StaffDetail />} path="staff/detail" />
    <Route element={<PrivateRoleListPage />} path="role" />
  </Routes>
);

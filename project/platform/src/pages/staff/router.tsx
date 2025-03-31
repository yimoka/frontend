import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { WithFooterLayout } from '@/layout/with-footer';

import { StaffLoginPage } from './login';
import { ChangePassword } from './password/change';

export const StaffRouter = () => (
  <WithFooterLayout>
    <Routes>
      <Route element={<StaffLoginPage />} path="login" />
      <Route element={<ChangePassword />} path="password/change" />
    </Routes>
  </WithFooterLayout>
);



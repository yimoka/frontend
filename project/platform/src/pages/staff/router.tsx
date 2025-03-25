import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { WithFooterLayout } from '@/layout/with-footer';

import { StaffLoginPage } from './login';
import { ChangePassword } from './password/change';

export const StaffRouter = () => (
  <WithFooterLayout>
    <Routes>
      <Route path="login" element={<StaffLoginPage />} />
      <Route path="password/change" element={<ChangePassword />} />
    </Routes>
  </WithFooterLayout>
);



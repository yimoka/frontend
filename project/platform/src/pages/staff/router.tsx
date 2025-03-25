import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { WithFooterLayout } from '@/layout/with-footer';

import { StaffLoginPage } from './login';

export const StaffRouter = () => (
  <WithFooterLayout>
    <Routes>
      <Route path="login" element={<StaffLoginPage />} />
    </Routes>
  </WithFooterLayout>
);



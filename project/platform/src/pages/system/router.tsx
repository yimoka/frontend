import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { PageNavByMenu } from '@/components/page-nav-by-menu';
import { WithSiderLayout } from '@/layout/with-sider';
import { SystemAccessRouter } from '@/pages/system/access/router';

export const SystemRouter = () => (
  <WithSiderLayout>
    <Routes>
      <Route element={<PageNavByMenu />} path="" />
      <Route element={<SystemAccessRouter />} path="access/*" />
    </Routes>
  </WithSiderLayout>
);

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { WithSiderLayout } from '@/layout/with-sider';
import { TableDemo } from '@/pages/demo/display/table';

export const DemoRouter = () => (
  <WithSiderLayout>
    <Routes>
      <Route path="display/table" element={<TableDemo />} />
    </Routes>
  </WithSiderLayout>
);
